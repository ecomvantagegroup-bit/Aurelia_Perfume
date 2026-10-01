import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import gsap from 'gsap';
import { assetUrl, loadAudio } from '@/utils/dataLoader';

const STORAGE_KEY = 'aurelia-sound';
const GESTURE_EVENTS = ['pointerdown', 'keydown', 'touchstart'];

// ---------------------------------------------------------------------------
// Looping background ambience.
//  - Settings (file path, volume, fades) come from data/audio.json; the file
//    path is resolved through assetUrl() so it works on the deployed base.
//  - Starts when the `start` prop turns true (pass !isLoading from App).
//  - Browsers block sound until the user interacts, so if play() is refused
//    the component waits for the first click/tap/key and starts then.
//  - A small toggle button lets the visitor mute/unmute; the choice is
//    remembered between visits.
//  - Pauses while the tab is hidden and resumes when it is visible again.
// ---------------------------------------------------------------------------
export default defineComponent({
  name: 'BackgroundAudio',
  props: {
    start: { type: Boolean, default: false },
  },
  setup(props) {
    const available = ref(false); // false until audio.json loads OK
    const enabled = ref(true); // visitor preference (sound on/off)
    const playing = ref(false);
    const blocked = ref(false); // autoplay refused, waiting for a gesture

    let audio = null;
    let config = null;
    let disposed = false;
    let gestureArmed = false;
    const volumeState = { value: 0 };

    const readPreference = () => {
      try {
        return window.localStorage.getItem(STORAGE_KEY) !== 'off';
      } catch {
        return true;
      }
    };

    const savePreference = (on) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
      } catch {
        /* storage unavailable (private mode) — preference just isn't saved */
      }
    };

    const fadeTo = (target, seconds, onDone) => {
      gsap.killTweensOf(volumeState);
      gsap.to(volumeState, {
        value: target,
        duration: seconds,
        ease: 'sine.inOut',
        onUpdate: () => {
          if (audio) audio.volume = Math.min(1, Math.max(0, volumeState.value));
        },
        onComplete: () => {
          if (onDone) onDone();
        },
      });
    };

    const disarmGesture = () => {
      if (!gestureArmed) return;
      gestureArmed = false;
      GESTURE_EVENTS.forEach((evt) => window.removeEventListener(evt, handleGesture));
    };

    const armGesture = () => {
      if (gestureArmed) return;
      gestureArmed = true;
      GESTURE_EVENTS.forEach((evt) =>
        window.addEventListener(evt, handleGesture, { passive: true })
      );
    };

    const tryPlay = () => {
      if (disposed || !audio || !enabled.value || !props.start) return;
      if (playing.value) return;

      const attempt = audio.play();
      if (attempt && typeof attempt.then === 'function') {
        attempt
          .then(() => {
            if (disposed) return;
            playing.value = true;
            blocked.value = false;
            disarmGesture();
            fadeTo(config.volume ?? 0.35, config.fadeInSeconds ?? 3);
          })
          .catch(() => {
            // Autoplay blocked: wait for the first user gesture.
            blocked.value = true;
            armGesture();
          });
      }
    };

    function handleGesture() {
      disarmGesture();
      tryPlay();
    }

    const stop = () => {
      if (!audio || !playing.value) return;
      playing.value = false;
      fadeTo(0, config?.fadeOutSeconds ?? 0.8, () => {
        if (audio && !playing.value) audio.pause();
      });
    };

    const toggle = () => {
      if (enabled.value) {
        enabled.value = false;
        savePreference(false);
        blocked.value = false;
        disarmGesture();
        stop();
      } else {
        enabled.value = true;
        savePreference(true);
        tryPlay(); // the click itself counts as the user gesture
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        tryPlay();
      }
    };

    watch(
      () => props.start,
      (val) => {
        if (val) tryPlay();
      }
    );

    onMounted(async () => {
      enabled.value = readPreference();

      try {
        config = await loadAudio();
      } catch (err) {
        console.error('[BackgroundAudio] Failed to load data/audio.json:', err);
        return; // no audio configured — render nothing
      }
      if (disposed || !config?.src) return;

      audio = new Audio(assetUrl(config.src));
      audio.loop = config.loop !== false;
      audio.preload = 'auto';
      audio.volume = 0;
      available.value = true;

      document.addEventListener('visibilitychange', handleVisibility);
      tryPlay();
    });

    onBeforeUnmount(() => {
      disposed = true;
      disarmGesture();
      document.removeEventListener('visibilitychange', handleVisibility);
      gsap.killTweensOf(volumeState);
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        audio = null;
      }
    });

    return () => {
      if (!available.value) return null;

      const label = !enabled.value
        ? 'Sound off'
        : blocked.value
          ? 'Tap to enable sound'
          : 'Sound on';
      const soundIsOn = enabled.value && !blocked.value;

      return (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={enabled.value}
          aria-label={enabled.value ? 'Mute background sound' : 'Play background sound'}
          class="fixed bottom-6 right-6 z-50 pointer-events-auto flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.25em] text-white/80 backdrop-blur-md transition-all duration-300 hover:border-amber-300/60 hover:text-amber-200"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5z" />
            {soundIsOn ? (
              <>
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </>
            ) : (
              <>
                <path d="m16 9 5 6" />
                <path d="m21 9-5 6" />
              </>
            )}
          </svg>
          <span>{label}</span>
        </button>
      );
    };
  },
});

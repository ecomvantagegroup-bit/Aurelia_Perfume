// ---------------------------------------------------------------------------
// Central helpers for JSON-driven config and base-aware asset URLs.
//
// Every asset path in the project (JSON files, image frames, GLB models) is
// written WITHOUT a leading "./" or "/" and is resolved through assetUrl(),
// which prefixes Vite's BASE_URL ("/" in dev, "/Aurelia_Perfume/" on GitHub
// Pages). That is what keeps the site working after deploy.
// ---------------------------------------------------------------------------

const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;

export const BASE_URL = import.meta.env.BASE_URL || '/';

export const assetUrl = (path = '') => {
    if (!path) return BASE_URL;
    // Full URLs (CDN, data:, blob:) are returned untouched.
    if (ABSOLUTE_URL.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
        return path;
    }
    return `${BASE_URL}${path.replace(/^(\.?\/)+/, '')}`;
};

export const DATA_PATHS = {
    content: 'data/content.json',
    sequences: 'data/sequences.json',
    models: 'data/models.json',
    audio: 'data/audio.json',
};

const cache = new Map();

export const loadJson = (path) => {
    if (cache.has(path)) return cache.get(path);

    const url = assetUrl(path);
    const request = fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
            return res.json();
        })
        .catch((err) => {
            cache.delete(path); // allow a retry on the next call
            throw err;
        });

    cache.set(path, request);
    return request;
};

export const loadContent = () => loadJson(DATA_PATHS.content);
export const loadSequences = () => loadJson(DATA_PATHS.sequences);
export const loadModels = () => loadJson(DATA_PATHS.models);
export const loadAudio = () => loadJson(DATA_PATHS.audio);

// Builds the URL of one frame: folder + zero-padded index + extension.
export const frameUrl = (folder, index, { extension = 'webp', padLength = 4, startIndex = 1 } = {}) => {
    const cleanFolder = String(folder).replace(/\/+$/, '');
    const name = String(startIndex + index).padStart(padLength, '0');
    return assetUrl(`${cleanFolder}/${name}.${extension}`);
};
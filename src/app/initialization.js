import { featureDetect } from '../utils/featureDetect.js';

export function initializeApp(container) {
  const features = featureDetect();
  if (!features.localStorage) {
    return { ready: false, error: 'localStorage is required but not available.', features };
  }
  container.seedManager.seedIfNeeded();
  return { ready: true, error: null, features };
}
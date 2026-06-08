/**
 * Feature detection utilities for the ChatApp Demo.
 *
 * Checks browser support for the two critical Web Platform APIs
 * required by the application:
 *   - localStorage (read/write test via try/catch)
 *   - BroadcastChannel (typeof check)
 *
 * Returns a feature report object consumed by the app shell to
 * decide whether to render the full UI or a fallback message.
 */

/**
 * Test whether localStorage is available and writable.
 * Uses a try/catch with a temporary key to detect:
 *   - Private browsing modes that throw on setItem
 *   - Quota exceeded scenarios
 *   - localStorage entirely disabled
 *
 * @returns {boolean}
 */
function checkLocalStorage() {
  try {
    const key = '__feature_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Test whether the BroadcastChannel API is available.
 * A simple typeof check suffices — if the constructor exists
 * the API is supported. No need for a runtime instantiation test
 * because BroadcastChannel construction does not throw in
 * unsupported contexts (it simply doesn't exist).
 *
 * @returns {boolean}
 */
function checkBroadcastChannel() {
  return typeof BroadcastChannel !== 'undefined';
}

/**
 * Run all feature detection checks and return a consolidated report.
 *
 * @returns {{
 *   localStorage: boolean,
 *   broadcastChannel: boolean,
 *   allAvailable: boolean,
 * }}
 */
export function featureDetect() {
  const localStorage = checkLocalStorage();
  const broadcastChannel = checkBroadcastChannel();

  return {
    localStorage,
    broadcastChannel,
    allAvailable: localStorage && broadcastChannel,
  };
}
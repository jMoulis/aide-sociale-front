// src/lib/utils/localStorage.ts

/**
 * Safely saves data to localStorage.
 * @param key - The key under which the data will be stored.
 * @param data - The data to be stored. It will be serialized to JSON.
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return; // Ensure this runs only on the client side
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error saving data to localStorage under key "${key}":`, error);
  }
}

/**
 * Loads data from localStorage.
 * @param key - The key associated with the data to be retrieved.
 * @returns The parsed data if available and valid, otherwise null.
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null; // Ensure this runs only on the client side
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) return null;
    return JSON.parse(serializedData) as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error loading data from localStorage under key "${key}":`, error);
    return null;
  }
}

/**
 * Removes data from localStorage.
 * @param key - The key associated with the data to be removed.
 */
export function clearLocalStorage(key: string): void {
  if (typeof window === 'undefined') return; // Ensure this runs only on the client side
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error clearing data from localStorage under key "${key}":`, error);
  }
}

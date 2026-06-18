interface StorageItem<T> {
  value: T;
  expiry: number;
}

export const STORAGE_KEYS = {
  SCENARIOS: "test_scenarios",
  PREVIOUS_SCENARIO_ID: "previous_scenario_id",
};

const DEFAULT_EXPIRY = 24 * 60 * 60 * 1000;

export const setWithExpiry = <T>(
  key: string,
  value: T,
  ttl = DEFAULT_EXPIRY,
): void => {
  const item: StorageItem<T> = {
    value,
    expiry: new Date().getTime() + ttl,
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(
      `setWithExpiry: Error storing item in localStorage: ${error}`,
    );
  }
};

export const getWithExpiry = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);

  // Return null if item doesn't exist
  if (!itemStr) {
    console.warn(
      `getWithExpiry: Item ${key} not found in localStorage. Returning null.`,
    );
    return null;
  }

  try {
    const item: StorageItem<T> = JSON.parse(itemStr);
    const now = new Date().getTime();

    // Compare current time with expiry time
    if (now > item.expiry) {
      // Item has expired, remove it
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error(
      `getWithExpiry: Error parsing item from localStorage: ${error}`,
    );
    return null;
  }
};

export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

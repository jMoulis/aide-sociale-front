import slugify from 'slugify';

export const slugifyFunction = (value: string) => {
  return slugify(value, {
    lower: true,
    strict: true,
    replacement: '-',
    remove: /\d+/g
  });
};

export function removeObjectFields<T extends object, K extends keyof T>(
  obj: T,
  forbiddenFields: K[]
): Omit<T, K> {
  // Filter out forbidden fields, resulting in allowed keys
  const allowedKeys = (Object.keys(obj) as (keyof T)[])
    .filter((key) => !forbiddenFields.includes(key as K)) as Exclude<keyof T, K>[];

  // Reduce over allowed keys only
  return allowedKeys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as Omit<T, K>);
}

export function sortArray<T, K extends keyof T>(
  array: T[],
  key: K,
  asc: boolean = true
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return asc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return asc ? aValue - bValue : bValue - aValue;
    }

    throw new Error('Unsupported type for sorting.');
  });
}

export const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;

  } catch (e) {
    return false
  }
}
import { format, isToday, isYesterday, Locale } from 'date-fns';
import slugify from 'slugify';
import { IPage, IProject, IProjectSummary, ITeam, ITeamSummary, ITreePage, IUser, IUserSummary, VDOMContext } from '../interfaces/interfaces';
import { parseISO, isValid } from "date-fns";

export const slugifyFunction = (value: string) => {
  return slugify(value, {
    lower: true,
    strict: true,
    replacement: '_',
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false
  }
}

export function formatTimestamp(timestamp: number, tTime: any, locale: Locale) {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return `${tTime('today')} - ${format(date, 'p', { locale })}`;
  } else if (isYesterday(date)) {
    return `${tTime('yesterday')} - ${format(date, 'p', { locale })}`;
  } else {
    return format(date, 'P p', { locale });
  }
}

export function getUserSummary(user: IUser): IUserSummary {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl
  };
}

export function getTeamSummary(team: ITeam): ITeamSummary {
  return {
    _id: team._id,
    name: team.name
  };
}

export function getProjectSummary(project: IProject): IProjectSummary {
  return {
    _id: project._id,
    name: project.name
  };
}

export function sortPages(pages: ITreePage[]): ITreePage[] {
  pages.sort((a, b) => {
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    } else if (a.position !== undefined) {
      return -1;
    } else if (b.position !== undefined) {
      return 1;
    } else {
      return 0;
    }
  });

  pages.forEach((page) => {
    if (page.children.length > 0) {
      page.children = sortPages(page.children);
    }
  });

  return pages;
}
export function buildPageTree(pages: IPage[]): ITreePage[] {
  const pageMap = new Map<string, ITreePage>();

  // Initialize map with pages and empty children arrays
  pages.forEach((page) => {
    pageMap.set(page._id, { ...page, children: [] });
  });

  // Build the tree structure
  const tree: ITreePage[] = [];
  pages.forEach((page) => {
    if (page.parentId) {
      const parent = pageMap.get(page.parentId);
      if (parent) {
        parent.children.push(pageMap.get(page._id)!);
      }
    } else {
      tree.push(pageMap.get(page._id)!);
    }
  });

  // Recursively sort the tree by position only
  return sortPages(tree);
}


export const convertDates = (obj: any): any => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(convertDates);
  }

  const newObj: any = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      const parsedDate = parseISO(obj[key]); // Try to parse as ISO date
      if (isValid(parsedDate)) {
        newObj[key] = parsedDate; // Convert only if it's a real date
        continue;
      }
    }

    if (typeof obj[key] === "object" && obj[key] !== null) {
      newObj[key] = convertDates(obj[key]); // Recursively handle nested objects
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};


export const getContextStoreDataset = (datasetKey: 'input' | 'output', context?: VDOMContext) => {
  if (!context?.dataset?.connexion?.[datasetKey]?.storeId) return null;
  return context?.dataset?.connexion?.[datasetKey]
}
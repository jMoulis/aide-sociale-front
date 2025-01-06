import slugify from 'slugify';

export const slugifyFunction = (value: string) => {
  return slugify(value, {
    lower: true,
    strict: true,
    replacement: '-',
    remove: /\d+/g
  });
};
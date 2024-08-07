export const isValidDate = (date: Date | null): boolean => {
  return date === null ? false : true;
};

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const copy = {} as Pick<T, K>;

  keys.forEach((key) => (copy[key] = obj[key]));

  return copy;
}

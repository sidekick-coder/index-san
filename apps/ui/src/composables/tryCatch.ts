export function tryCatch<T extends Function>(tryer: T) {
  try {
    const result = tryer();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

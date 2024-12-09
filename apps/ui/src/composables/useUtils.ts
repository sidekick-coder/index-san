export async function tryCatch<T extends Function>(tryer: T) {
  try {
    const result = await tryer();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

export function copy<T>(value: T) {
  return JSON.parse(JSON.stringify(value));
}

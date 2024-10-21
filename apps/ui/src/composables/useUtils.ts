export async function tryCatch<T extends Function>(tryer: T) {
  try {
    const result = await tryer();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

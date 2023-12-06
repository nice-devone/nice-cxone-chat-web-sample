interface WithId {
  id: string;
}

export function mergeMessages<T extends WithId>(
  original: Map<string, T>,
  next: Array<T>,
): Map<string, T> {
  return [...next, ...Array.from(original.values())].reduce((acc, current) => {
    return acc.set(current.id, current);
  }, new Map<string, T>());
}

const DATA_PREFIX = "washub::";

export function saveItem<T>(key: string, value: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${DATA_PREFIX}${key}`, JSON.stringify(value));
  }
}

export function getItem<T>(key: string): T | null | undefined {
  if (typeof window !== "undefined") {
    const got = localStorage.getItem(`${DATA_PREFIX}${key}`);
    return got ? (JSON.parse(got) as T) : null;
  }
}

export function removeItem(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${DATA_PREFIX}${key}`);
  }
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

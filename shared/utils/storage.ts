

export function loadFromLocal<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function saveToLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}


export function loadFromSession<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function saveToSession<T>(key: string, value: T) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

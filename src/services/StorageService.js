export class StorageService {
  read(key, fallback) { throw new Error("read() not implemented"); }
  write(key, value) { throw new Error("write() not implemented"); }
}

export class LocalStorageService extends StorageService {
  read(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }
}

export class MemoryStorageService extends StorageService {
  #data = new Map();
  read(key, fallback = null) { return this.#data.has(key) ? this.#data.get(key) : fallback; }
  write(key, value) { this.#data.set(key, value); }
}

class Cache {
  constructor() {
    this.cache = {};
  }

  setCache(key, value) {
    this.cache[key] = value;
  }

  getCache(key) {
    if (this.cache[key]) return this.cache[key];
    return null;
  }
}

const CacheService = new Cache();

class Cache {
  constructor() {
    this.cache = {};
  }

  setCache(key, value) {
    this.cache[key] = value;
  }

  getCache(key) {
    return this.cache[key] || null;
  }
}

const CacheServiceInstance = new Cache();

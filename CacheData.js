class cache {
  constructor() {
    this.cache = {};
  }

  setCache(key, value) {
    this.cache[key] = value;
  }

  getCache(key) {
    if (this.cache[key]) {
      return this.cache[key];
    } else {
      return null;
    }
  }
}

const CacheServiceInstance = new cache();

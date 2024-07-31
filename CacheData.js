class Cache {
  constructor() {
    this.cache = {};
  }

  setCache(key, value) {
    console.log(this.cache);
    this.cache[key] = value;
  }

  getCache(key) {
    console.log(this.cache);
    if (this.cache[key]) return this.cache[key];
    return null;
  }
}

const CacheService = new Cache();

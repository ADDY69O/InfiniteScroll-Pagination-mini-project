class Cache {
  constructor() {
    this.cache = {};
    this.isTouched = [];
  }

  setCache(key, value) {
    this.cache[key] = value;
  }

  getCacheData() {
    return this.cache;
  }

  getCache(key) {
    if (this.cache[key]) return this.cache[key];
    return null;
  }

  addToTouched(page, limit) {
    // Create the new item to be added
    const newItem = { page, limit };

    // Insert the new item in sorted order
    this.isTouched.push(newItem);
    this.isTouched.sort((a, b) => a.page - b.page); // Sort by 'page' in ascending order

    console.log(this.isTouched);
  }

  getSmallerPageIndex = (page) => {
    let pageIndex = -1;

    for (let i = 0; i < this.isTouched.length; i++) {
      if (this.isTouched[i].page > page) {
        pageIndex = i;
        break;
      }
    }

    if (pageIndex === -1) {
      return this.isTouched.length - 1;
    }

    return pageIndex;
  };

  getPageIndex = (page) => {
    let pageIndex = -1;

    for (let i = 0; i < this.isTouched.length; i++) {
      if (this.isTouched[i].page == page) {
        pageIndex = i;
        break;
      }
    }

    return pageIndex;
  };
}

const CacheService = new Cache();

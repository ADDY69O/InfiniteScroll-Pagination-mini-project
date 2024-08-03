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

  updateTouchedForNewLimit(newLimit) {
    const totalData = paginationInstance.getTotalRecords();
    if (paginationInstance.previousPageLimit > newLimit) {
      // create automatically pages
      const totalItems = this.isTouched ? this.isTouched.length : 0;
      let totalRecords = totalItems * paginationInstance.previousPageLimit;
      let pagesRequired = totalRecords / newLimit;
      let remainingPage = pagesRequired - totalItems;

      let adjustedTouched = [];

      for (let i = 0; i < totalItems; i++) {
        let newTotalPages = Math.ceil(totalData / newLimit);
        let page;
        if (this.isTouched[i].page > newTotalPages) {
          if (i == 0) {
            page = 1;
          } else {
            page = this.isTouched[i - 1].page + 1;
          }
        } else {
          page = this.isTouched[i].page;
        }

        adjustedTouched.push({ page, limit: newLimit });
        let nextNewPage = page + 1;
        while (remainingPage > 0 && this.getPageIndex(nextNewPage) === -1) {
          adjustedTouched.push({ page: nextNewPage, limit: newLimit });
          remainingPage--;
          nextNewPage++;
        }
      }

      this.isTouched = adjustedTouched;
      paginationInstance.setCurrentPage(
        this.isTouched[this.isTouched.length - 1].page
      );
      paginationInstance.setPreviousPage(this.isTouched[0].page);
      console.log(this.isTouched);

      return { done: true };
    } else {
      let prevTakeEle = 1;
      const adjustedTouched = [];
      const totalItems = this.isTouched ? this.isTouched.length : 0;

      if (totalItems == 0) return;
      console.log("inside");

      let totalRecords = totalItems * paginationInstance.previousPageLimit;

      let remainingRecords = totalRecords % newLimit;
      let reqIteration = Math.ceil(totalRecords / newLimit);
      console.log(reqIteration);
      if (remainingRecords > 0) {
        for (let i = 0; i < reqIteration; i++) {
          let newTotalPages = Math.ceil(totalData / newLimit);
          let page;
          if (this.isTouched[i].page > newTotalPages) {
            if (i == 0) {
              page = 1;
            } else {
              page = this.isTouched[i - 1].page + 1;
            }
          } else {
            page = this.isTouched[i].page;
          }

          adjustedTouched.push({ page, limit: newLimit });
        }
        this.isTouched = adjustedTouched;
        paginationInstance.setCurrentPage(
          this.isTouched[this.isTouched.length - 1].page
        );
        paginationInstance.setPreviousPage(this.isTouched[0].page);

        console.log(this.isTouched);
        return { done: true };
      } else {
        for (let i = 0; i < reqIteration; i++) {
          let page;

          if (i > this.isTouched.length) {
            page = prevTakeEle;
            prevTakeEle += 1;
          } else {
            page = this.isTouched[i].page;
          }

          let newTotalPages = Math.ceil(totalData / newLimit);

          if (this.isTouched[i].page > newTotalPages) {
            if (i == 0) {
              page = 1;
            } else {
              page = this.isTouched[i - 1].page + 1;
            }
          } else {
            page = this.isTouched[i].page;
          }

          adjustedTouched.push({ page, limit: newLimit });
        }
        this.isTouched = adjustedTouched;
        console.log(this.isTouched, " ------------------------");
        paginationInstance.setCurrentPage(
          this.isTouched[this.isTouched.length - 1].page
        );
        paginationInstance.setPreviousPage(this.isTouched[0].page);
        return { done: false, req: remainingRecords };
      }

      // const newTotalPages = Math.ceil(totalItems / newLimit);

      // for (let i = 1; i <= newTotalPages; i++) {
      //   adjustedTouched.push({ page: i, limit: newLimit });
      // }

      // this.isTouched = adjustedTouched;
    }
  }

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

class Pagination {
  constructor(
    currentPage,
    totalLimit,
    totalPages,
    totalRecords,
    initialOffset,
    previousPage
  ) {
    this.currentPage = currentPage;
    this.totalLimit = totalLimit;
    this.totalPages = totalPages;
    this.totalRecords = totalRecords;
    this.initialOffset = initialOffset;
    this.previousPage = previousPage;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }
  getPreviousPage() {
    return this.previousPage;
  }

  setPreviousPage(page) {
    this.previousPage = page;
  }

  getTotalLimit() {
    return this.totalLimit;
  }

  setTotalLimit(limit) {
    this.totalLimit = limit;
  }

  getTotalPages() {
    return this.totalPages;
  }

  setTotalPages(pages) {
    this.totalPages = pages;
  }

  getTotalRecords() {
    return this.totalRecords;
  }

  setTotalRecords(records) {
    this.totalRecords = records;
  }

  incrementCurrentPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  decrementCurrentPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}

const paginationInstance = new Pagination(1, 10, 0, 0, 0, 0);

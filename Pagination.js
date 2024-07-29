class Pagination {
  constructor(
    currentPage,
    totalLimit,
    totalRecords,
    totalPages,
    previousPage,
    nextPage
  ) {
    this.currentPage = currentPage;
    this.totalLimit = totalLimit;
    this.totalRecords = totalRecords;
    this.totalPages = totalPages;
    this.previousPage = previousPage;
    this.nextPage = nextPage;
  }

  getCurrentPage() {
    return this.currentPage;
  }
  setCurrentPage(page) {
    this.currentPage = page;
  }

  getTotalLimit() {
    return this.totalLimit;
  }
  setTotalLimit(limit) {
    this.totalLimit = limit;
  }

  getTotalRecords() {
    return this.totalRecords;
  }
  setTotalRecords(record) {
    this.totalRecords = record;
  }

  getTotalPages() {
    return this.totalPages;
  }
  setTotalPages(page) {
    this.totalPages = page;
  }

  getPreviousPage() {
    return this.previousPage;
  }
  getPreviousPage(page) {
    this.previousPage = page;
  }
}

const paginationInstance = new Pagination(1, 10, 0, 0, 0);

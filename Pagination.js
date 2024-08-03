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
    this.previousPageLimit = 0;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  setCurrentPage(page) {
    console.trace();
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

  getProducts = async (
    page,
    limit,
    prev = false,
    offsetChange = false,
    previousPage = null,
    isgap = false,
    isScrolling = false
  ) => {
    try {
      const productDiv = document.querySelector(".products");
      const productDiv2 = document.querySelector(".products");
      console.log(page, limit, prev, offsetChange, previousPage, isgap);
      if (
        isScrolling ||
        (prev && previousPage !== null && previousPage > page)
      ) {
        const data = await apiServiceInstance.getProducts(
          page,
          limit,
          prev,
          previousPage,
          offsetChange
        );

        const index = CacheService.getSmallerPageIndex(page);

        let indexAfterAdd = (index - 1) * limit;

        const allElements = Array.from(productDiv.childNodes);

        data.posts.forEach((product, idx) => {
          try {
            let newDiv = domCreateElement("div", "product");
            let title = domCreateElement("h1", "product__title", product.title);
            let body = domCreateElement("p", "product__body", product.body);

            let tagDiv = domCreateElement("div", "product__tag");
            let tagTitle = domCreateElement("h3", "tag__title", "Tags:");
            tagDiv.appendChild(tagTitle);

            product.tags.forEach((tag) => {
              let tagEle = domCreateElement("p", "tag__ele", tag);
              tagDiv.appendChild(tagEle);
            });

            let views = domCreateElement(
              "p",
              "product__views",
              `Views: ${product.views}`
            );

            let reactions = domCreateElement(
              "p",
              "product__reactions",
              `Likes: ${product.reactions.likes} | Dislikes: ${product.reactions.dislikes}`
            );

            let hr = document.createElement("hr");

            [title, hr, body, tagDiv, views, reactions].forEach((item) => {
              newDiv.appendChild(item);
            });

            if (indexAfterAdd < productDiv.childNodes.length) {
              productDiv.insertBefore(
                newDiv,
                productDiv.childNodes[indexAfterAdd]
              );
            } else {
              productDiv.appendChild(newDiv);
            }

            indexAfterAdd += 1;
          } catch (error) {
            console.error("Error adding product:", error);
          }
        });

        this.setPreviousPage(page);
        this.updateButtonStates(true);
        this.updateScroll(true);
      } else {
        // console.trace();
        document.getElementById("loader").style.display = "block";
        const data = await apiServiceInstance.getProducts(
          page,
          limit,
          prev,
          previousPage,
          offsetChange
        );

        if (this.getTotalRecords() !== data.total || offsetChange) {
          this.setTotalRecords(data.total);
          this.setTotalPages(Math.ceil(data.total / this.getTotalLimit()));

          const paginationDiv =
            document.getElementsByClassName("pagination__btn")[0];
          if (offsetChange) {
            paginationDiv.innerHTML = "";
          }

          for (let i = 1; i <= this.getTotalPages(); i++) {
            let newPage = domCreateElement("div", "pages", i);
            newPage.setAttribute("id", i);
            newPage.addEventListener("click", (e) => {
              const newPageNumber = Number(e.target.innerText);

              if (this.getCurrentPage() === newPageNumber) {
                const msg = "can't call the same page twice";

                Toastify({ text: msg, backgroundColor: "red" }).showToast();
              } else {
                const previousCachedData = CacheService.isTouched;

                let previousPage = this.getCurrentPage();
                if (previousPage > newPageNumber) {
                  // this.setCurrentPage(newPageNumber);
                  // this.setPreviousPage(previousPage);
                  // this.updateButtonStates();
                  this.getProducts(
                    newPageNumber,
                    this.getTotalLimit(),
                    true,
                    false,
                    previousPage
                  );
                } else {
                  this.setCurrentPage(newPageNumber);
                  this.setPreviousPage(previousPage);
                  // this.updateButtonStates();
                  this.getProducts(
                    this.getCurrentPage(),
                    this.getTotalLimit(),
                    false,
                    false,
                    previousPage
                  );
                }
              }
            });
            paginationDiv.appendChild(newPage);
          }
        }

        if (offsetChange) {
          productDiv.innerHTML = "";
        }

        data.posts.forEach((product) => {
          let newDiv = domCreateElement("div", "product");

          let title = domCreateElement("h1", "product__title", product.title);

          let body = domCreateElement("p", "product__body", product.body);

          let tagDiv = domCreateElement("div", "product__tag");

          let tagTitle = domCreateElement("h3", "tag__title", "Tags:");

          tagDiv.appendChild(tagTitle);

          product.tags.forEach((tag) => {
            let tagEle = domCreateElement("p", "tag__ele", tag);

            tagDiv.appendChild(tagEle);
          });

          let views = domCreateElement(
            "p",
            "product__views",
            `Views: ${product.views}`
          );

          let reactions = domCreateElement(
            "p",
            "product__reactions",
            `Likes: ${product.reactions.likes} | Dislikes: ${product.reactions.dislikes}`
          );
          let hr = document.createElement("hr");

          [title, hr, body, tagDiv, views, reactions].forEach((item) => {
            newDiv.appendChild(item);
          });

          productDiv.appendChild(newDiv);
        });

        if (prev) {
          this.setPreviousPage(page);
          this.updateButtonStates(true);

          this.updateScroll(true);
        } else {
          this.updateButtonStates();

          this.updateScroll();
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      document.getElementById("loader").style.display = "none";
    }
  };

  updateScroll = (prev = false) => {
    const productDiv = document.getElementsByClassName("products")[0];
    // productDiv.scrollTop = 0;
    const singlePageHeight =
      productDiv.scrollHeight / CacheService.isTouched.length;

    let page = prev
      ? CacheService.getSmallerPageIndex(paginationInstance.getPreviousPage())
      : CacheService.isTouched.length;

    productDiv.scrollTop = singlePageHeight * (page - 1);
  };

  handleNext = () => {
    if (this.getCurrentPage() < this.getTotalPages()) {
      this.incrementCurrentPage();
      this.updateButtonStates();
      this.getProducts(this.getCurrentPage(), this.getTotalLimit());
    }
  };

  handleBack = () => {
    if (this.getCurrentPage() > 1) {
      let previousPage;
      // if (this.getPreviousPage() < this.getCurrentPage()) {
      //   previousPage = this.getPreviousPage();
      //   this.setCurrentPage(this.getPreviousPage() - 1);
      //   this.setPreviousPage(previousPage);
      // } else {
      previousPage = this.getCurrentPage();
      this.setCurrentPage(this.currentPage - 1);

      // }

      this.getProducts(
        this.getCurrentPage(),
        this.getTotalLimit(),
        true,
        false,
        previousPage
      );
    }
  };

  updateButtonStates = (previous = false) => {
    const btnPrev = document.querySelector(".pagination_prev");
    const btnNext = document.querySelector(".pagination__next");

    let page = previous ? this.getPreviousPage() : this.getCurrentPage();

    btnPrev.disabled = page === 1;
    btnNext.disabled = page === this.getTotalPages();

    if (previous) {
      this.updatePageStyles(true);
    } else {
      this.updatePageStyles();
    }
  };

  updatePageStyles = (previous = false) => {
    let pageNo = previous ? this.getPreviousPage() : this.getCurrentPage();

    document.querySelectorAll(".pages").forEach((page, index) => {
      if (index + 1 === pageNo) {
        page.classList.add("active");
        const pgnBtn = document.querySelector(".pagination__btn");

        let pageheight = pgnBtn.scrollWidth / this.getTotalPages();
        let heightReq = pageheight * pageNo;
        let leftHeight = heightReq - pgnBtn.clientWidth;

        pgnBtn.scrollLeft = leftHeight;
      } else {
        page.classList.remove("active");
      }
    });
  };
}

const paginationInstance = new Pagination(1, 10, 0, 0, 0, 0);

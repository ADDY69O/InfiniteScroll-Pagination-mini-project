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

  getProducts = async (
    page,
    limit,
    prev = false,
    offsetChange = false,
    previousPage = null
  ) => {
    const productDiv = document.getElementsByClassName("products")[0];

    if (prev && previousPage !== null && previousPage > page) {
      console.log("calling inside ");
      let itemsToRemove = (previousPage - page) * limit;
      while (itemsToRemove > 0 && productDiv.lastChild) {
        productDiv.removeChild(productDiv.lastChild);
        itemsToRemove--;
      }
      this.updatePageStyles();
      this.updateButtonStates();
    } else {
      try {
        document.getElementById("loader").style.display = "block";
        const data = await apiServiceInstance.getProducts(
          page,
          limit,
          prev,
          previousPage
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
            newPage.addEventListener("click", (e) => {
              e.preventDefault();
              const newPageNumber = Number(e.target.innerText);

              if (this.getCurrentPage() === newPageNumber) {
                const msg = "can't call the same page twice";

                Toastify({ text: msg, backgroundColor: "red" }).showToast();
              } else {
                let previousPage = this.getCurrentPage();
                this.setCurrentPage(newPageNumber);
                this.setPreviousPage(0);
                this.updateButtonStates();
                this.getProducts(
                  this.getCurrentPage(),
                  this.getTotalLimit(),
                  true,
                  false,
                  previousPage
                );
              }
            });
            paginationDiv.appendChild(newPage);
          }
        }

        if (prev) {
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

        this.updateScroll();
        this.updatePageStyles();
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        document.getElementById("loader").style.display = "none";
      }
    }
  };

  updateScroll = () => {
    const productDiv = document.getElementsByClassName("products")[0];
    const singlePageHeight = productDiv.scrollHeight / this.getCurrentPage();
    productDiv.scrollTop = singlePageHeight * (this.getCurrentPage() - 1);
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
      let previousPage = this.getCurrentPage();
      this.decrementCurrentPage();
      this.updateButtonStates();
      this.getProducts(
        this.getCurrentPage(),
        this.getTotalLimit(),
        true,
        false
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

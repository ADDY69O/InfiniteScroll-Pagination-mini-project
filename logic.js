const getProducts = async (page, limit, prev = false, offsetChange = false) => {
  try {
    document.getElementById("loadingIndicator").style.display = "block";
    const data = await apiServiceInstance.getProducts(page, limit, prev);

    if (paginationInstance.getTotalRecords() !== data.total || offsetChange) {
      paginationInstance.setTotalRecords(data.total);
      paginationInstance.setTotalPages(
        Math.ceil(data.total / paginationInstance.getTotalLimit())
      );

      const paginationDiv = document.getElementsByClassName("pageBtn")[0];
      if (offsetChange) {
        paginationDiv.innerHTML = "";
      }

      for (let i = 1; i <= paginationInstance.getTotalPages(); i++) {
        let newPage = document.createElement("div");
        newPage.innerText = i;
        newPage.setAttribute("class", "pages");
        newPage.addEventListener("click", (e) => {
          const newPageNumber = Number(e.target.innerText);
          if (paginationInstance.getCurrentPage() === newPageNumber) {
            const msg = "can't call the same page twice";
            console.log(msg);
            Toastify({ text: msg, backgroundColor: "red" }).showToast();
          } else {
            paginationInstance.setCurrentPage(newPageNumber);
            updatePageStyles();
            updateButtonStates();
            getProducts(
              paginationInstance.getCurrentPage(),
              paginationInstance.getTotalLimit(),
              true
            );
          }
        });
        paginationDiv.appendChild(newPage);
      }
    }

    const productDiv = document.getElementsByClassName("Products")[0];
    if (prev) {
      productDiv.innerHTML = "";
      window.scrollTo(0, 0);
    }

    data.posts.forEach((product) => {
      let newDiv = document.createElement("div");
      newDiv.setAttribute("class", "Product");

      let title = document.createElement("h1");
      title.setAttribute("class", "productTitle");
      title.innerText = product.title;

      let body = document.createElement("p");
      body.setAttribute("class", "productBody");
      body.innerText = product.body;

      let tagDiv = document.createElement("div");
      tagDiv.setAttribute("class", "productTag");

      let tagTitle = document.createElement("h3");
      tagTitle.setAttribute("class", "tagTitle");
      tagTitle.innerText = "Tags:";

      tagDiv.appendChild(tagTitle);

      product.tags.forEach((tag) => {
        let tagEle = document.createElement("p");
        tagEle.setAttribute("class", "tagEle");
        tagEle.innerText = tag;
        tagDiv.appendChild(tagEle);
      });

      let views = document.createElement("p");
      views.setAttribute("class", "productViews");
      views.innerText = `Views: ${product.views}`;

      let reactions = document.createElement("p");
      reactions.setAttribute("class", "productReactions");
      reactions.innerHTML = `Likes: ${product.reactions.likes} | Dislikes: ${product.reactions.dislikes}`;

      newDiv.appendChild(title);
      newDiv.appendChild(document.createElement("hr"));
      newDiv.appendChild(body);
      newDiv.appendChild(tagDiv);
      newDiv.appendChild(views);
      newDiv.appendChild(reactions);

      productDiv.appendChild(newDiv);
    });

    updatePageStyles();
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    // Hide loading indicator
    document.getElementById("loadingIndicator").style.display = "none";
  }
};

const loadInitialProducts = () => {
  getProducts(
    paginationInstance.getCurrentPage(),
    paginationInstance.getTotalLimit()
  );
};

document.addEventListener("DOMContentLoaded", loadInitialProducts);

document.querySelector(".Products").addEventListener("scroll", (event) => {
  let { clientHeight, scrollHeight, scrollTop } = event.target;

  checkCurrentPage(clientHeight, scrollHeight, scrollTop);

  if (clientHeight + scrollTop + 1 >= scrollHeight) {
    if (
      paginationInstance.getCurrentPage() + 1 >
      paginationInstance.getTotalPages()
    ) {
      const msg = "End of the page";
      Toastify({ text: msg, backgroundColor: "red" }).showToast();
    } else {
      paginationInstance.incrementCurrentPage();
      updateButtonStates();
      getProducts(
        paginationInstance.getCurrentPage(),
        paginationInstance.getTotalLimit()
      );
    }
  }
});

const handleNext = () => {
  if (
    paginationInstance.getCurrentPage() < paginationInstance.getTotalPages()
  ) {
    paginationInstance.incrementCurrentPage();
    updateButtonStates();
    getProducts(
      paginationInstance.getCurrentPage(),
      paginationInstance.getTotalLimit()
    );
  }
};

const handleBack = () => {
  if (paginationInstance.getCurrentPage() > 1) {
    paginationInstance.decrementCurrentPage();
    updateButtonStates();
    getProducts(
      paginationInstance.getCurrentPage(),
      paginationInstance.getTotalLimit(),
      true
    );
  }
};

const handleOffsetChange = (e) => {
  let newLimit = Number(e.target.value);
  paginationInstance.setTotalLimit(newLimit);
  paginationInstance.setCurrentPage(1);
  getProducts(
    paginationInstance.getCurrentPage(),
    paginationInstance.getTotalLimit(),
    true,
    true
  );
};

document
  .getElementById("offset")
  .addEventListener("change", handleOffsetChange);

const updatePageStyles = (previous = false) => {
  let pageNo = previous
    ? paginationInstance.getPreviousPage()
    : paginationInstance.getCurrentPage();
  document.querySelectorAll(".pages").forEach((page, index) => {
    if (index + 1 === pageNo) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }
  });
};

const updateButtonStates = (previous = false) => {
  const btnPrev = document.querySelector(".btnPrev");
  const btnNext = document.querySelector(".btnNext");

  let page = previous
    ? paginationInstance.getPreviousPage()
    : paginationInstance.getCurrentPage();

  btnPrev.disabled = page === 1;
  btnNext.disabled = page === paginationInstance.getTotalPages();

  if (previous) {
    updatePageStyles(true);
  } else {
    updatePageStyles();
  }
};

const checkCurrentPage = (clientHeight, scrollHeight, scrollTop) => {
  let reqDistribution = scrollHeight / paginationInstance.getCurrentPage();
  let currentHeight = scrollTop + clientHeight;

  for (let i = 1; i <= paginationInstance.getCurrentPage(); i++) {
    if (reqDistribution * i > currentHeight) {
      paginationInstance.setPreviousPage(i);
      updateButtonStates(true);
      break;
    }
  }
};

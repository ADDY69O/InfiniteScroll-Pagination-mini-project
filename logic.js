let currentPage = 1;
let totalLimit = 10;
let totalRecords = 0;
let totalPages = 0;

const getProducts = async (page, limit, prev = false) => {
  try {
    const data = await apiServiceInstance.getProducts(page, limit, prev);

    if (totalRecords === 0) {
      totalRecords = data.total;
      totalPages = Math.ceil(totalRecords / totalLimit);

      let paginationDiv = document.getElementsByClassName("pageBtn")[0];

      for (let i = 1; i <= totalPages; i++) {
        let newPage = document.createElement("div");
        newPage.innerText = i;
        newPage.setAttribute("class", "pages");
        newPage.addEventListener("click", (e) => {
          const newPageNumber = Number(e.target.innerText);
          if (currentPage === newPageNumber) {
            const msg = "can't call the same page twice";
            console.log(msg);
            Toastify({ text: msg, backgroundColor: "red" }).showToast();
          } else {
            currentPage = newPageNumber;
            updatePageStyles();
            updateButtonStates();
            getProducts(currentPage, totalLimit, true);
          }
        });
        paginationDiv.appendChild(newPage);
      }
    }

    let productDiv = document.getElementsByClassName("Products")[0];
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
  }
};

const loadInitialProducts = () => {
  getProducts(currentPage, totalLimit);
};

document.addEventListener("DOMContentLoaded", loadInitialProducts);

document.querySelector(".Products").addEventListener("scroll", (event) => {
  let { clientHeight, scrollHeight, scrollTop } = event.target;
  if (
    clientHeight + scrollTop + 1 >= scrollHeight &&
    currentPage < totalPages
  ) {
    currentPage += 1;
    updateButtonStates();
    getProducts(currentPage, totalLimit);
  }
});

const handleNext = () => {
  if (currentPage < totalPages) {
    currentPage += 1;
    updateButtonStates();
    getProducts(currentPage, totalLimit);
  }
};

const handleBack = () => {
  if (currentPage > 1) {
    currentPage -= 1;
    updateButtonStates();
    getProducts(currentPage, totalLimit, true);
  }
};

const updateButtonStates = () => {
  document.querySelector(".btnPrev").disabled = currentPage === 1;
  document.querySelector(".btnNext").disabled = currentPage === totalPages;
  updatePageStyles();
};

const updatePageStyles = () => {
  document.querySelectorAll(".pages").forEach((page, index) => {
    if (index + 1 === currentPage) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }
  });
};

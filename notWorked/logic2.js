let currentPage = 1;
let totalLimit = 10;
let totalRecords = 0;
let totalPages = 0;

const getProducts = async (page, limit) => {
  try {
    // Fetch the data of the posts
    let response = await fetch(
      `https://dummyjson.com/posts?limit=${totalLimit}&skip=${
        (page - 1) * limit
      }`
    );
    let data = await response.json();
    console.log(data);

    // Update total records and pages
    if (totalRecords === 0) {
      totalRecords = data.total;
      totalPages = Math.ceil(totalRecords / totalLimit);
      console.log(totalPages);

      // Get the access of pagination page div
      let paginationDiv = document.getElementsByClassName("pageBtn")[0];

      // Loop the total pages and show the page numbers
      for (let i = 1; i <= totalPages; i++) {
        let newDiv = document.createElement("div");
        let newPage = document.createElement("p");

        // Update properties of the p tag
        newPage.innerText = i;
        newPage.setAttribute("class", "pages");
        newPage.style.color = currentPage === i ? "blue" : "black";
        newPage.addEventListener("click", (e) => {
          currentPage = Number(e.target.innerText);
          getProducts(currentPage, totalLimit);
        });

        newDiv.appendChild(newPage);
        paginationDiv.appendChild(newDiv);
      }
    }

    // Show the posts
    let responseData = data.posts;
    console.log(responseData);

    let iframe = document.getElementById("productsIframe");
    if (!iframe) {
      console.error("Error: iframe not found");
      return;
    }

    let iframeDocument =
      iframe.contentDocument || iframe.contentWindow.document;

    if (!iframeDocument) {
      console.error("Error: iframe document not found");
      return;
    }

    let productDiv = iframeDocument.getElementsByClassName("Products")[0];
    if (!productDiv) {
      console.error("Error: productDiv not found");
      return;
    }

    // Append new products
    responseData.forEach((product) => {
      let newDiv = document.createElement("div");
      newDiv.setAttribute("class", "Product");

      let title = document.createElement("h1");
      title.setAttribute("class", "productTitle");
      title.innerText = product.title;

      let body = document.createElement("p");
      body.setAttribute("class", "productBody");
      body.innerText = product.body;

      let tagDiv = document.createElement("div");
      tagDiv.setAttribute("class", "poductTag");

      let tagTitle = document.createElement("h3");
      tagTitle.setAttribute("class", "tagTitle");
      tagTitle.innerText = "Tags :";

      tagDiv.appendChild(tagTitle);

      product.tags.forEach((tag) => {
        let tagEle = document.createElement("p");
        tagEle.setAttribute("class", "tagEle");
        tagEle.innerText = tag;
        tagDiv.appendChild(tagEle);
      });

      let views = document.createElement("p");
      views.setAttribute("class", "productViews");
      views.innerText = `views: ${product.views}`;

      newDiv.appendChild(title);
      newDiv.appendChild(body);
      newDiv.appendChild(tagDiv);
      newDiv.appendChild(views);

      productDiv.appendChild(newDiv);
    });

    // Ensure the iframe content has access to global variables
    iframeDocument.defaultView.currentPage = currentPage;
    iframeDocument.defaultView.totalLimit = totalLimit;
    iframeDocument.defaultView.totalPages = totalPages;
    iframeDocument.defaultView.getProducts = getProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return;
  }
};

// Ensure the iframe has fully loaded before accessing its document
document.getElementById("productsIframe").addEventListener("load", () => {
  getProducts(currentPage, totalLimit);

  // Attach scroll event listener
  let iframe = document.getElementById("productsIframe");
  let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

  iframeDocument
    .querySelector(".Products")
    .addEventListener("scroll", (event) => {
      let { clientHeight, scrollHeight, scrollTop } = event.target;
      if (
        clientHeight + scrollTop + 1 >= scrollHeight &&
        currentPage < totalPages
      ) {
        currentPage += 1;
        getProducts(currentPage, totalLimit);
      }
    });
});

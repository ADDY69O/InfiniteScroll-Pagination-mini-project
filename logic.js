const loadInitialProducts = () => {
  paginationInstance.getProducts(
    paginationInstance.getCurrentPage(),
    paginationInstance.getTotalLimit()
  );
};

document.addEventListener("DOMContentLoaded", loadInitialProducts);

document.querySelector(".products").addEventListener("scroll", (event) => {
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
      paginationInstance.setCurrentPage(
        paginationInstance.getCurrentPage() + 1
      );
      paginationInstance.updateButtonStates();
      paginationInstance.getProducts(
        paginationInstance.getCurrentPage(),
        paginationInstance.getTotalLimit()
      );
    }
  }
});

document.getElementById("offset__Select").addEventListener("change", (e) => {
  let newLimit = Number(e.target.value);
  paginationInstance.setTotalLimit(newLimit);
  paginationInstance.setCurrentPage(1);
  paginationInstance.getProducts(
    paginationInstance.getCurrentPage(),
    paginationInstance.getTotalLimit(),
    true,
    true
  );
});

const checkCurrentPage = (clientHeight, scrollHeight, scrollTop) => {
  let reqDistribution = scrollHeight / paginationInstance.getCurrentPage();
  let currentHeight = scrollTop + clientHeight;
  for (let i = 1; i <= paginationInstance.getCurrentPage(); i++) {
    if (reqDistribution * i > currentHeight) {
      paginationInstance.setPreviousPage(i);
      paginationInstance.updateButtonStates(true);
      break;
    }
  }
};

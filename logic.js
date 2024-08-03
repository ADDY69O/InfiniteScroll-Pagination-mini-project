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
  paginationInstance.previousPageLimit = paginationInstance.getTotalLimit();
  paginationInstance.setTotalLimit(newLimit);
  paginationInstance.setPreviousPage(paginationInstance.getCurrentPage());
  paginationInstance.setCurrentPage(1);
  paginationInstance.getProducts(
    paginationInstance.getCurrentPage(),
    paginationInstance.getTotalLimit(),
    true,
    true
  );
});

const checkCurrentPage = (clientHeight, scrollHeight, scrollTop) => {
  let reqDistribution = scrollHeight / CacheService.isTouched.length;
  let currentHeight = scrollTop + clientHeight;

  for (let i = 1; i <= CacheService.isTouched.length; i++) {
    let currentP = CacheService.isTouched[i - 1].page;

    let limitP = CacheService.isTouched[i - 1].limit;

    if (reqDistribution * i > currentHeight) {
      console.log(reqDistribution, currentHeight, currentP);
      console.log("inside");
      // const previousPageData = CacheService.getPageIndex(
      //   paginationInstance.getCurrentPage()
      // );
      // console.log(previousPageData, paginationInstance.getCurrentPage());
      // let curentIndex = -1;
      // previousPageData.forEach((item, index) => {
      //   if (item.page === paginationInstance.getCurrentPage()) {
      //     curentIndex = index;
      //   }
      // });
      // console.log(
      //   currentP +
      //     " " +
      //     paginationInstance.getCurrentPage() +
      //     " " +
      //     paginationInstance.getPreviousPage()
      // );

      let previousDataIndex = -1;

      previousDataIndex = CacheService.getPageIndex(currentP - 1);

      console.log(
        "distribution " +
          reqDistribution +
          " current i value " +
          i +
          " clientHeight " +
          clientHeight
      );

      if (
        i > 1 &&
        reqDistribution * i > currentHeight &&
        reqDistribution * (i - 1) > currentHeight - 10 &&
        previousDataIndex === -1
      ) {
        paginationInstance.getProducts(
          currentP - 1,
          paginationInstance.getTotalLimit(),
          true,
          false,
          currentP,
          true,
          true
        );
      }
      // if (
      //   paginationInstance.getCurrentPage() !==
      //     paginationInstance.getPreviousPage() &&
      //   currentP > 1 &&
      //   previousDataIndex === -1
      // ) {
      //   // paginationInstance.setPreviousPage(currentP - 1);
      //   paginationInstance.getProducts(
      //     currentP - 1,
      //     paginationInstance.getTotalLimit(),
      //     true,
      //     false,
      //     CacheService.isTouched[i - 1].page,
      //     true,
      //     true
      //   );
      // }
      else {
        paginationInstance.setPreviousPage(currentP);
        paginationInstance.updateButtonStates(true);
      }
      break;
    }
  }
};

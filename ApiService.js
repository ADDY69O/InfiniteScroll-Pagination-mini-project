class ApiService extends BaseApiService {
  constructor(baseURL) {
    super(baseURL);
  }

  async loginUser(data) {
    try {
      let responseData = await this.post("user/login", data);
      if (responseData.token) {
        this.setStorageData("userInfo", responseData.token);
        this.showMessage(responseData.message, "success");
      } else {
        this.showMessage(responseData.message, "error");
      }
      return true;
    } catch (error) {
      console.error("Error while Login", error);
    }
  }

  async registerUser(data) {
    try {
      let responseData = await this.post("user/register", data);
      this.setStorageData("userInfo", responseData.token);
      this.showMessage(responseData.message, "success");
      return true;
    } catch (error) {
      console.error("Error while Register User", error);
    }
  }

  async getProducts(
    page,
    limit,
    prev = false,
    previousPage = null,
    offsetChange = false
  ) {
    try {
      if (offsetChange) {
        let ChangedCache = CacheService.updateTouchedForNewLimit(limit);

        const newData = { posts: [], total: 0 };
        const data = CacheService.getCacheData();

        console.log(data);

        for (let key in data) {
          if (data[key].posts && Array.isArray(data[key].posts)) {
            newData.total = data[key].total;
            data[key].posts.forEach((post) => {
              newData.posts.push(post);
            });
          }
        }

        const totalData = newData.posts.length;
        const requiredPage = Math.ceil(totalData / limit);

        console.log(requiredPage);
        console.log(limit);
        console.log(newData);
        console.log(newData.posts.length);

        // paginationInstance.setCurrentPage(requiredPage);

        if (requiredPage * limit <= newData.posts.length) {
          newData.posts = newData.posts.slice(0, requiredPage * limit);
          return newData;
        } else if (requiredPage * limit > newData.posts.length) {
          const totalDataReq = requiredPage * limit;
          const remainingData = totalDataReq - newData.posts.length;
          const newSkip = newData.posts.length;
          const newLimit = remainingData;
          const endPoint = `posts?limit=${newLimit}&skip=${newSkip}`;

          const additionalData = await this._get(endPoint);

          additionalData.posts.forEach((post) => {
            newData.posts.push(post);
          });

          return newData;
        }
      } else {
        let endpoint = `posts?limit=${limit}&skip=${(page - 1) * limit}`;

        CacheService.addToTouched(page, limit);

        // if (prev) {
        //   endpoint = `posts?limit=${limit * (page - previousPage)}&skip=${
        //     previousPage * limit
        //   }`;
        // }

        return await this._get(endpoint);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
}

const apiServiceInstance = new ApiService(`https://dummyjson.com/`);

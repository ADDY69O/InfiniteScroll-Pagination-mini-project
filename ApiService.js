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

  async getProducts(page, limit, prev = false, previousPage = null) {
    try {
      let endpoint = `posts?limit=${limit}&skip=${(page - 1) * limit}`;
      if (prev) {
        endpoint = `posts?limit=${limit * (page - previousPage)}&skip=${
          previousPage * limit
        }`;
      }
      return await this._get(endpoint);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
}

const apiServiceInstance = new ApiService(`https://dummyjson.com/`);

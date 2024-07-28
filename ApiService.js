class ApiService extends BaseApiService {
  constructor(baseURL) {
    super(baseURL);
  }

  async loginUser(data) {
    let responseData = await this.post("user/login", data);
    if (responseData.token) {
      this.setStorageData("userInfo", responseData.token);
      this.showMessage(responseData.message, "success");
    } else {
      this.showMessage(responseData.message, "error");
    }
    return true;
  }

  async registerUser(data) {
    let responseData = await this.post("user/register", data);
    this.setStorageData("userInfo", responseData.token);
    this.showMessage(responseData.message, "success");
    return true;
  }

  async getProducts(page, limit, prev = false) {
    try {
      let endpoint = `posts?limit=${limit}&skip=${(page - 1) * limit}`;
      if (prev) {
        endpoint = `posts?limit=${limit * page}&skip=${(1 - 1) * limit}`;
      }
      return await this._get(endpoint);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
}

const apiServiceInstance = new ApiService(`https://dummyjson.com/`);

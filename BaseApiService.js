class BaseApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async post(endPoints, data) {
    try {
      const response = await fetch(this.baseUrl + endPoints, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.showMessage(errorData.message, "error");
        return;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      this.showMessage("Internal Server error", "error");
      throw error;
    }
  }

  async _get(endPoints) {
    try {
      let cacheResponseData = CacheService.getCache(this.baseUrl + endPoints);
      if (cacheResponseData == null) {
        const response = await fetch(this.baseUrl + endPoints);
        if (!response.ok) {
          const errorData = await response.json();
          this.showMessage(errorData.message, "error");
          throw new Error(errorData.message);
        }

        const responseData = await response.json();
        CacheService.setCache(this.baseUrl + endPoints, responseData);
        return responseData;
      } else {
        return cacheResponseData;
      }
    } catch (error) {
      this.showMessage("Internal Server error", "error");
      throw error;
    }
  }

  showMessage(msg, type) {
    const text = msg || "Internal Server error";

    const style = { backgroundColor: type === "success" ? "green" : "red" };

    Toastify({ text, ...style }).showToast();
  }

  getStorageData(key) {
    return localStorage.getItem(key);
  }

  setStorageData(key, value) {
    localStorage.setItem(key, value);
  }
}

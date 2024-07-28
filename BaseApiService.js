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
    }
  }

  async _get(endPoints) {
    try {
      const response = await fetch(this.baseUrl + endPoints);
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        this.showMessage(errorData.message, "error");
        return;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      this.showMessage("Internal Server error", "error");
    }
  }

  showMessage(msg, type) {
    type === "success"
      ? Toastify({ text: msg, backgroundColor: "green" }).showToast()
      : Toastify({
          text: msg || "Internal Server error",
          backgroundColor: "red",
        }).showToast();
  }

  getStorageData(key) {
    return localStorage.getItem(key);
  }

  setStorageData(key, value) {
    localStorage.setItem(key, value);
  }
}

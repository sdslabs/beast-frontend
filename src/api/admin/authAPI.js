import { axiosInstance } from "../axiosInstance.js";
import store from "../../store/index";
import router from "../../router/index.js";

export default {
  async loginUser(username, password) {
    let bodyFormData = new FormData();
    bodyFormData.append("username", username);
    bodyFormData.append("password", password);
    let response = await axiosInstance({
      method: "post",
      url: `/auth/login`,
      data: bodyFormData
    });
    return Promise.resolve(response);
  },

  async loggedInUser(username, password) {
    const response = await this.loginUser(username, password);
    if (response.status === 200) {
      await store.commit(
        "updateUserAuth",
        response.data.token,
        response.data.role
      );
      if (response.data.role === "admin") {
        router.push("/admin/");
      } else {
        router.push("/");
      }
    } else {
      alert("Login attempt failed: " + response.data.message);
    }
    return;
  },

  async registerUser(name, username, email, password) {
    let bodyFormData = new FormData();
    bodyFormData.append("name", name);
    bodyFormData.append("username", username);
    bodyFormData.append("password", password);
    bodyFormData.append("email", email);
    let response = await axiosInstance({
      method: "post",
      url: `/auth/register`,
      data: bodyFormData
    });
    return Promise.resolve(response);
  },

  async registeredUser(name, username, email, password) {
    const response = await this.registerUser(name, username, email, password);
    if (response.status === 200) {
      router.push("/login");
    } else {
      alert("Registration attempt failed: " + response.data.message);
    }
    return;
  }
};

import axiosInstance from "../axiosInstance.js";
import store from "../../store/index";
import router from "../../router/index.js";

export default {
  async loginUser(username, password) {
    let bodyFormData = new FormData();
    bodyFormData.append("username", username);
    bodyFormData.append("password", password);
    return await axiosInstance({
      method: "post",
      url: `/auth/login`,
      data: bodyFormData
    }).catch(err => {
      console.log(err);
    });
    // try {
    //   let response = await axiosInstance({
    //     method: 'post',
    //     url: `/auth/login`,
    //     data: bodyFormData,
    //   })
    //   console.log(response)
    //   return Promise.resolve(response)
    // } catch (err) {
    //   console.log(err)
    //   let response = err
    //   return response
    // }
  },

  async loggedInUser(username, password) {
    const response = await this.loginUser(username, password);
    if (response.status === 200) {
      const { token, role } = response.data;
      store.commit("updateUserAuth", { username, token, role });
      if (response.data.role === "admin") {
        router.push("/admin/");
      } else {
        router.push("/about");
      }
    } else {
      if (response.message.includes("400")) {
        return 400;
      } else if (response.message.includes("401")) {
        return 401;
      } else if (response.message.includes("403")) {
        return 403;
      }
    }
  },

  async registerUser(name, username, email, password) {
    let bodyFormData = new FormData();
    bodyFormData.append("name", name);
    bodyFormData.append("username", username);
    bodyFormData.append("password", password);
    bodyFormData.append("email", email);
    try {
      let response = await axiosInstance({
        method: "post",
        url: `/auth/register`,
        data: bodyFormData
      });
      return Promise.resolve(response);
    } catch (err) {
      let response = err;
      return response;
    }
  },

  async registeredUser(name, username, email, password) {
    const response = await this.registerUser(name, username, email, password);
    if (response.status === 200) {
      router.push("/login");
    } else {
      alert("Registration attempt failed: " + response.message);
    }
    return;
  },

  async resetPass(newPassword) {
    let bodyFormData = new FormData();
    bodyFormData.append("new_pass", newPassword);
    try {
      let response = await axiosInstance({
        method: "post",
        url: `/auth/reset-password`,
        data: bodyFormData
      });
      return Promise.resolve(response);
    } catch (err) {
      let response = err;
      return response;
    }
  },

  async resetPassword(newPassword) {
    const response = await this.resetPass(newPassword);
    if (response.status === 200) {
      return true;
    }
    return false;
  }
};

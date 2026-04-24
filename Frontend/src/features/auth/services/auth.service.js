import axios from "axios";

const authaApiInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export const register = async ({
  email,
  contact,
  fullname,
  password,
  isSeller = false,
}) => {
  try {
    const response = await authaApiInstance.post("/register", {
      email,
      contact,
      fullname,
      password,
      isSeller,
    });

    return response.data;
  } catch (error) {
    const validationMessage = error.response?.data?.errors?.[0]?.msg;
    const message =
      error.response?.data?.message ||
      validationMessage ||
      "Registration failed";

    throw new Error(message);
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await authaApiInstance.post("/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    const validationMessage = error.response?.data?.errors?.[0]?.msg;
    const message =
      error.response?.data?.message || validationMessage || "Login failed";

    throw new Error(message);
  }
};

export const getMe = async () => {
  const response = await authaApiInstance.get("/me");
  return response.data;
};

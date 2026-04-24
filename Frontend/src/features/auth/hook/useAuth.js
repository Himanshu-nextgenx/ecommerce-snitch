// eslint-disable-next-line no-unused-vars
import { setLoading, setUser, setError } from "../state/auth.slice.js";

import { register, login, getMe } from "../services/auth.service.js";
import { useDispatch } from "react-redux";


export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async ({
    email,
    contact,
    fullname,
    password,
    isSeller,
  }) => {
    const data = await register({
      email,
      contact,
      fullname,
      password,
      isSeller,
    });

    dispatch(setUser(data.user));
    return data.user;
  };
  const handleLogin = async ({ email, password }) => {
    const data = await login({ email, password });

    dispatch(setUser(data.user));
    return data.user;
  };
  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
    
  };

  return { handleRegister, handleLogin, handleGetMe };
};

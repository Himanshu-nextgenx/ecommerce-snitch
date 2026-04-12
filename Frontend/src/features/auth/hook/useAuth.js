// eslint-disable-next-line no-unused-vars
import { setLoading, setUser, setError } from "../state/auth.slice.js";

import { register } from "../services/auth.service.js";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async ({ email, contact, fullname, password , isSeller}) => {
    const data = await register({ email, contact, fullname, password, isSeller });

    dispatch(setUser(data.user));
  };

  return { handleRegister };
};

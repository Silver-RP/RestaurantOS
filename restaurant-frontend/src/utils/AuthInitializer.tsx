import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { AppDispatch } from "../redux/store";
import { fetchUserById } from "../redux/feature/user/userAction";
import { DecodedToken } from "types/Auth.type";

const AuthInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) return;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userId = decoded.id;

      dispatch(fetchUserById({ userId, token }));
    } catch (err) {
      console.error("Lỗi khi giải mã token:", err);
    }
  }, [dispatch]);

  return null;
};

export default AuthInitializer;

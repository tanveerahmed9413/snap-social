import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { logOut, signIn, signUp } from "../services/auth.api";
import { useNavigate } from "react-router-dom";
import {
  dismissToast,
  showError,
  showLoading,
  showSuccess,
} from "../../../utils/toast";

export function useAuth() {
  const { setUser, user, loading, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const signup = async (formData) => {
    const id = showLoading("Account Creating...");
    try {
      setLoading(true);
      const user = await signUp(formData);

      showSuccess("Account Created");
      setUser(user);

      navigate("/app/home");

      return user;
    } catch (error) {
      showError(error?.message || "Something went wrong");
    } finally {
      dismissToast(id);
      setLoading(false);
    }
  };

  const signin = async (formData) => {
    const id = showLoading("Logging in...");
    try {
      setLoading(true);
      const user = await signIn(formData);

      showSuccess("Login Successful");
      setUser(user);

      navigate("/app/home");
      return user;
    } catch (error) {
      showError(error?.message || "Something went wrong");
    } finally {
      dismissToast(id);
      setLoading(false);
    }
  };

  const signout = async () => {
    const id = showLoading("Logging out....");
    try {
      setLoading(true);
      await logOut();

      showSuccess("Logout Successful");
      setUser(null);

      navigate("/signin");
    } catch (error) {
      showError(error?.message || "Something went wrong");
    } finally {
      dismissToast(id);
      setLoading(false);
    }
  };

  return {
    signup,
    signin,
    signout,
    user,
    loading,
  };
}

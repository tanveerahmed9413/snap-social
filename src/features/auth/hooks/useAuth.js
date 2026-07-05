import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { logOut, signIn, signUp } from "../services/auth.api";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const { setUser, user, loading, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const signup = async (formData) => {
    try {
      setLoading(true);
      const user = await signUp(formData);

      setUser(user);

      navigate("/app/home");

      return user;
    } finally {
      setLoading(false);
    }
  };

  const signin = async (formData) => {
    try {
      setLoading(true);
      const user = await signIn(formData);

      setUser(user);

      navigate("/app/home");
      return user;
    } finally {
      setLoading(false);
    }
  };

  const signout = async () => {
    try {
      setLoading(true);
      await logOut();
      setUser(null);

      navigate("/signin");
    } finally {
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

import { useState } from "react";
import SignUpForm from "../components/SignUpForm";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signup(form);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEyeButton = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <SignUpForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      handleEyeButton={handleEyeButton}
      showPassword={showPassword}
    />
  );
}

export default SignUp;

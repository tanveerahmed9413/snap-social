import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye } from "lucide-react";
import SignInForm from "../components/SignInForm";
import { useAuth } from "../hooks/useAuth";

const SignIn = () => {
  const { signin } = useAuth();
  const [showPassword, setShowPassword] = useState(false)

  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signin(form);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEyeButton = () =>{
    setShowPassword((prev) => !prev)
  }

  return (
    <SignInForm
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleEyeButton={handleEyeButton}
      showPassword={showPassword}
    />
  );
};

export default SignIn;

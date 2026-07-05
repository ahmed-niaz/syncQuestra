"use client";
import { AuthForm } from "@/components/forms/authForms";
import { loginWithCredintials } from "@/lib/actions/auth.action";

import { LoginSchema } from "@/lib/zod/validation";

const Login = () => {
  return (
    <AuthForm
      formType="LOG_IN"
      schema={LoginSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={loginWithCredintials}
    />
  );
};

export default Login;

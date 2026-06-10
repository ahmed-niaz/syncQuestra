"use client";
import { AuthForm } from "@/components/forms/authForms";

import { LoginSchema } from "@/lib/validation";

const Login = () => {
  return (
    <AuthForm
      formType="LOG_IN"
      schema={LoginSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default Login;

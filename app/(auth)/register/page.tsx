"use client";

import { AuthForm } from "@/components/forms/authForms";
import { RegisterSchema } from "@/lib/zod/validation";
import React from "react";

const Register = () => {
  return (
    <AuthForm
      formType="REGISTER"
      schema={RegisterSchema}
      defaultValues={{ username: "", email: "", password: "", name: "" }}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default Register;

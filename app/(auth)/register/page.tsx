"use client";

import { AuthForm } from "@/components/forms/authForms";
import { registerWithCredintials } from "@/lib/actions/auth.action";
import { RegisterSchema } from "@/lib/zod/validation";
import React from "react";

const Register = () => {
  return (
    <AuthForm
      formType="REGISTER"
      schema={RegisterSchema}
      defaultValues={{ username: "", email: "", password: "", name: "" }}
      onSubmit={registerWithCredintials}
    />
  );
};

export default Register;

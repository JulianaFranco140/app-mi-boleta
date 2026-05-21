"use client";

import React from "react";
import AuthForm, { FormField } from "../../presentation/components/AuthForm";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const fields: FormField[] = [
    {
      id: "email",
      label: "Correo Electrónico",
      type: "email",
      placeholder: "ejemplo@correo.com",
      icon: <Mail size={18} />,
    },
    {
      id: "password",
      label: "Contraseña",
      type: "password",
      placeholder: "••••••••",
      icon: <Lock size={18} />,
    },
  ];

  const handleLogin = (data: Record<string, string>) => {
    console.log("Login data:", data);
    // TODO: Connect to application domain
  };

  return (
    <AuthForm
      title="Bienvenido de nuevo"
      subtitle="Ingresa tus credenciales para continuar"
      fields={fields}
      submitLabel="Iniciar Sesión"
      footerText="¿No tienes una cuenta?"
      footerAction="Regístrate"
      footerLink="/register"
      onSubmit={handleLogin}
    />
  );
}

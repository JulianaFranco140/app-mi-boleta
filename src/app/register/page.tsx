"use client";

import React from "react";
import AuthForm, { FormField } from "../../presentation/components/AuthForm";
import { Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const fields: FormField[] = [
    {
      id: "name",
      label: "Nombre completo",
      type: "text",
      placeholder: "Juan Pérez",
      icon: <User size={18} />,
    },
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

  const handleRegister = (data: Record<string, string>) => {
    console.log("Register data:", data);
    // TODO: Connect to application domain
  };

  return (
    <AuthForm
      title="Crear una cuenta"
      subtitle="Únete a MiBoleta para empezar a jugar"
      fields={fields}
      submitLabel="Registrarse"
      footerText="¿Ya tienes una cuenta?"
      footerAction="Inicia Sesión"
      footerLink="/login"
      onSubmit={handleRegister}
    />
  );
}

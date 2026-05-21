"use client";

import React, { FormEvent } from "react";
import Link from "next/link";
import { Award } from "lucide-react";
import styles from "./AuthForm.module.css";

export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  icon: React.ReactNode;
}

interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: FormField[];
  submitLabel: string;
  footerText: string;
  footerAction: string;
  footerLink: string;
  onSubmit: (data: Record<string, string>) => void;
}

export default function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  footerText,
  footerAction,
  footerLink,
  onSubmit,
}: AuthFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fields.forEach((field) => {
      data[field.id] = formData.get(field.id) as string;
    });
    onSubmit(data);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/">
            <div className={styles.logo}>
              <Award size={24} strokeWidth={2.5} />
            </div>
          </Link>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.id} className={styles.fieldGroup}>
              <label htmlFor={field.id} className={styles.label}>
                {field.label}
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.icon}>{field.icon}</span>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  className={styles.input}
                />
              </div>
            </div>
          ))}

          <button type="submit" className={styles.submitBtn}>
            {submitLabel}
          </button>
        </form>

        <div className={styles.footer}>
          <Link href={footerLink} className={styles.footerLink}>
            {footerText} <b>{footerAction}</b>
          </Link>
        </div>
      </div>
    </div>
  );
}

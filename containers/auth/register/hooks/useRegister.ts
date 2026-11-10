import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "../actions";
import { registerSchema, type RegisterInput } from "../Register.types";

export default function useRegister() {
  // Email yang baru didaftarkan; bila terisi, form diganti layar "Cek email".
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterInput) => {
    const result = await register(values);
    // Tanpa hasil: action melakukan redirect (Confirm email nonaktif).
    if (!result) return;
    if (result.success) {
      setRegisteredEmail(result.data?.email ?? values.email);
      return;
    }

    Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
      form.setError(field as keyof RegisterInput, { message: messages[0] });
    });
    form.setError("root", { message: result.message });
  };

  return {
    ...form,
    onSubmit,
    registeredEmail,
  };
}

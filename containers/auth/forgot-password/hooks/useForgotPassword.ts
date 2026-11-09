import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "../actions";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../ForgotPassword.types";

export default function useForgotPassword() {
  // Bila true, form diganti pesan "Bila email terdaftar, …".
  const [isSent, setIsSent] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    const result = await requestPasswordReset(values);
    if (result.success) {
      setIsSent(true);
      return;
    }

    Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
      form.setError(field as keyof ForgotPasswordInput, {
        message: messages[0],
      });
    });
    form.setError("root", { message: result.message });
  };

  return {
    ...form,
    onSubmit,
    isSent,
  };
}

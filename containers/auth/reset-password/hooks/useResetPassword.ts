import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updatePassword } from "../actions";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../ResetPassword.types";

export default function useResetPassword() {
  const router = useRouter();
  const form = useForm<ResetPasswordInput>({
    defaultValues: { password: "", password_confirmation: "" },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    const result = await updatePassword(values);
    if (result.success) {
      // Toaster ada di root layout, jadi toast tetap tampil setelah pindah halaman.
      toast.success("Password berhasil diubah", { id: "password-updated" });
      router.replace("/akun");
      return;
    }

    Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
      form.setError(field as keyof ResetPasswordInput, {
        message: messages[0],
      });
    });
    form.setError("root", { message: result.message });
  };

  return {
    ...form,
    onSubmit,
  };
}

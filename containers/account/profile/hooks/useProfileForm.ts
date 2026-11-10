import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateProfile } from "../actions";
import { profileSchema, type ProfileInput } from "../Profile.types";

export default function useProfileForm(defaultValues: ProfileInput) {
  const form = useForm<ProfileInput>({
    defaultValues,
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (values: ProfileInput) => {
    const result = await updateProfile(values);
    // Tanpa hasil: session berakhir dan action mengarahkan ke /login.
    if (!result) return;
    if (result.success) {
      toast.success("Profil berhasil disimpan", { id: "profile-saved" });
      // Nilai tersimpan menjadi nilai awal baru, agar tombol Simpan kembali nonaktif.
      form.reset(values);
      return;
    }

    Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
      form.setError(field as keyof ProfileInput, { message: messages[0] });
    });
    form.setError("root", { message: result.message });
  };

  return {
    ...form,
    onSubmit,
  };
}

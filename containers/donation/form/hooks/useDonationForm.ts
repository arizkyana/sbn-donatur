import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDonation } from "../actions";
import { donationSchema, type DonationInput } from "../DonationForm.types";

/** Data donatur dari profil, untuk isi awal form saat login. */
export type DonorDefaults = Pick<
  DonationInput,
  "donor_name" | "donor_email" | "donor_phone"
>;

export default function useDonationForm(
  slug: string,
  donor: DonorDefaults | null,
) {
  const form = useForm<DonationInput>({
    defaultValues: {
      slug,
      amount: undefined,
      donor_name: donor?.donor_name ?? "",
      donor_email: donor?.donor_email ?? "",
      donor_phone: donor?.donor_phone ?? "",
      is_anonymous: false,
    },
    resolver: zodResolver(donationSchema),
  });

  // Kembali dari Midtrans lewat tombol back bisa memulihkan halaman dari bfcache
  // dengan tombol masih "Memproses...". Reset status submit tanpa menghapus isian.
  const { reset } = form;
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reset(undefined, { keepValues: true });
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [reset]);

  const onSubmit = async (values: DonationInput) => {
    const result = await createDonation(values);
    if (result.success) {
      // Halaman pembayaran ada di domain Midtrans, jadi bukan router.push().
      // isSubmitSuccessful menjaga tombol tetap disabled selama berpindah halaman.
      if (result.data) window.location.assign(result.data.redirectUrl);
      return;
    }

    Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
      form.setError(field as keyof DonationInput, { message: messages[0] });
    });
    form.setError("root", { message: result.message });
  };

  return {
    ...form,
    onSubmit,
  };
}

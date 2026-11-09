"use client";

import { useFormStatus } from "react-dom";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      className="w-full text-destructive"
      disabled={pending}
    >
      {pending ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
      Keluar
    </Button>
  );
}

export default function LogoutButton() {
  return (
    <form action={logout}>
      <SubmitButton />
    </form>
  );
}

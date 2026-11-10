"use client";

import { useRef } from "react";
import { ArrowLeftIcon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBackNavigation } from "@/hooks/use-back-navigation";

type SearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export default function SearchBar({ query, onQueryChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Dibuka langsung (tanpa riwayat di app): kembali ke beranda.
  const handleBack = useBackNavigation("/");

  return (
    <form
      role="search"
      className="sticky top-16 z-10 flex items-center gap-2 bg-background/95 px-4 py-3 backdrop-blur"
      onSubmit={(event) => {
        event.preventDefault();
        // Menutup keyboard HP; hasil sudah dicari saat mengetik.
        inputRef.current?.blur();
      }}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Kembali"
        onClick={handleBack}
      >
        <ArrowLeftIcon className="size-6" />
      </Button>
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-primary" />
        <Input
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          autoFocus
          placeholder="Cari campaign kebaikan…"
          aria-label="Cari judul campaign"
          className="h-12 pr-11 pl-11 shadow-card [&::-webkit-search-cancel-button]:appearance-none"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Hapus kata kunci"
            className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full"
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
          >
            <XIcon />
          </Button>
        )}
      </div>
    </form>
  );
}

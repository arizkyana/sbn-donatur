"use client";

import { useState } from "react";
import { NewspaperIcon, TriangleAlertIcon } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BlogFilters from "./components/BlogFilters";
import PostCard from "./components/PostCard";
import PostCardSkeleton from "./components/PostCardSkeleton";
import useCategories from "./hooks/useCategories";
import usePosts, { type PostTypeFilter } from "./hooks/usePosts";

export function BlogList() {
  const [type, setType] = useState<PostTypeFilter>("ALL");
  const [categoriesId, setCategoriesId] = useState<number | null>(null);
  const isFiltered = type !== "ALL" || categoriesId !== null;

  const { data: categories = [] } = useCategories();
  const {
    data,
    isPending,
    isError,
    isPlaceholderData,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePosts({ type, categoriesId });

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <EmptyState
          icon={TriangleAlertIcon}
          title="Daftar blog gagal dimuat"
          description="Periksa koneksi internet, lalu coba lagi."
          action={
            <Button
              variant="outline"
              disabled={isRefetching}
              onClick={() => refetch()}
            >
              Coba lagi
            </Button>
          }
        />
      );
    }

    const posts = data.pages.flatMap((page) => page.rows);
    if (posts.length === 0) {
      return (
        <EmptyState
          icon={NewspaperIcon}
          title={
            isFiltered ? "Tidak ada post untuk filter ini" : "Belum ada post"
          }
          description={
            isFiltered
              ? "Coba pilih tipe atau kategori lain."
              : "Kabar program dan kegiatan akan tampil di sini."
          }
        />
      );
    }

    return (
      <>
        <div
          className={cn(
            "flex flex-col gap-4 transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} eager={index === 0} />
          ))}
        </div>
        {hasNextPage && (
          <Button
            variant="outline"
            disabled={isFetchingNextPage || isPlaceholderData}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Memuat..." : "Muat lebih banyak"}
          </Button>
        )}
      </>
    );
  };

  return (
    <section className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Blog</h1>
      <BlogFilters
        type={type}
        categoriesId={categoriesId}
        categories={categories}
        onTypeChange={setType}
        onCategoryChange={setCategoriesId}
      />
      {renderContent()}
    </section>
  );
}

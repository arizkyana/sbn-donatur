"use client";

import { useState } from "react";
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
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Daftar blog gagal dimuat.
          </p>
          <Button
            variant="outline"
            disabled={isRefetching}
            onClick={() => refetch()}
          >
            Coba lagi
          </Button>
        </div>
      );
    }

    const posts = data.pages.flatMap((page) => page.rows);
    if (posts.length === 0) {
      return (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {isFiltered ? "Tidak ada post untuk filter ini" : "Belum ada post"}
          </p>
        </div>
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
      <h1 className="text-xl font-semibold">Blog</h1>
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

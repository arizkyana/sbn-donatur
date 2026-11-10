"use client";

import useSearchQuery from "../hooks/useSearchQuery";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import SearchSuggestions from "./SearchSuggestions";

export default function SearchContent() {
  const { query, setQuery, keyword } = useSearchQuery();

  return (
    <div className="flex flex-col">
      <SearchBar query={query} onQueryChange={setQuery} />
      <div className="flex flex-col gap-4 px-4 pt-1 pb-4">
        {keyword ? <SearchResults keyword={keyword} /> : <SearchSuggestions />}
      </div>
    </div>
  );
}

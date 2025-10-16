"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
  debounceMs?: number;
}

export function SearchBar({
  onSearch,
  placeholder = "Search posts...",
  defaultValue = "",
  debounceMs = 500,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch, debounceMs]);

  const handleClear = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-10 h-12 text-base shadow-royal border-royal-200 dark:border-royal-700 focus:ring-royal-500 dark:focus:ring-royal-400"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 h-8 w-8 hover:bg-royal-100 dark:hover:bg-royal-800/30"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </div>
  );
}

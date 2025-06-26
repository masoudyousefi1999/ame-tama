"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FAQSearchProps {
  onSearch: (query: string) => void;
}

export function FAQSearch({ onSearch }: FAQSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-8" dir="rtl">
      <div className="relative">
        <Input
          type="text"
          placeholder="جستجوی سوالات..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          /*   logical paddings instead of pl / pr   */
          className="w-full pe-10 ps-20 py-6 text-lg bg-background text-foreground"
        />

        {/* search button – keeps the brand gradient that already
         maps to your `primary` colours via the Button component */}
        <Button
          type="submit"
          size="sm"
          className="absolute start-1 top-1/2 -translate-y-1/2"
        >
          جستجو
        </Button>

        {/* icon already uses a token colour */}
        <Search className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>
    </form>
  );
}

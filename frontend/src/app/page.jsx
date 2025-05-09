"use client";

import { useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ReviewSummary from "../components/ReviewSummary";
import ReviewGrid from "../components/ReviewGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);

  const handleSearch = async (url) => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/scrape`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setReviews(data.reviews);
    setSummary(data.summary);
    setLoading(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="px-4 md:px-12 py-6">
        <SearchBar onSearch={handleSearch} />
        {loading && <LoadingSkeleton />}
        {!loading && summary && <ReviewSummary summary={summary} />}
        {!loading && reviews.length > 0 && <ReviewGrid reviews={reviews} />}
      </main>
    </div>
  );
}

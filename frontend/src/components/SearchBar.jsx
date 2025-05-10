"use client";

import React, { useState, useEffect } from "react";

export default function SearchBar({ onSearch, setLoading }) {
  const [mode, setMode] = useState("url"); // 'url' or 'name'
  const [input, setInput] = useState("");
  //const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   const fetchSuggestions = async () => {
  //     if (input.length < 3 || mode !== "name") return;
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/suggestions?q=${input}`);
  //     const data = await res.json();
  //     setSuggestions(data);
  //   };

  //   const delayDebounce = setTimeout(fetchSuggestions, 300);
  //   return () => clearTimeout(delayDebounce);
  // }, [input, mode]);

  const handleSubmit = async () => {
    if (input.trim() === "") {
      setError("Please enter something.");
      return;
    }

    setError("");
    setLoading(true);

    if (mode === "url") {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input }),
      });

      const { url, name } = await res.json();
      if (url && name) {
        onSearch(url, name);
      } else {
        setError("Could not find a matching business.");
      }
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: input }),
      });

      const { url, name } = await res.json();
      if (url && name) {
        onSearch(url, name);
      } else {
        setError("Could not find a matching business.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 max-w-xl mx-auto">
      <div className="flex mb-2 space-x-2">
        <button
          className={`px-4 py-2 rounded hover:cursor-pointer ${mode === "url" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => {
            setMode("url");
            setInput("");
            setError("");
            //setSuggestions([]);
          }}
        >
          Paste URL
        </button>
        <button
          className={`px-4 py-2 rounded hover:cursor-pointer ${mode === "name" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => {
            setMode("name");
            setInput("");
            setError("");
            //setSuggestions([]);
          }}
        >
          Search by Name
        </button>
      </div>

      <input
        type="text"
        placeholder={mode === "url" ? "Paste Google URL" : "Type Business Name"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded mb-2"
      />

      {/* {suggestions.length > 0 && mode === "name" && (
        <ul className="border border-gray-300 rounded mb-2 max-h-40 overflow-y-auto">
          {suggestions.map((sugg, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => setInput(sugg.name)}
            >
              {sugg.name}
            </li>
          ))}
        </ul>
      )} */}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-accent hover:cursor-pointer"
      >
        Search
      </button>
    </div>
  );
}

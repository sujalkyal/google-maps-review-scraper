import React from "react";

export default function Header() {
  return (
    <header className="bg-background text-text p-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold text-accent">ReviewScope</h1>
      <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition">Get Started</button>
    </header>
  );
}
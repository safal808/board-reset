"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClearBoard = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/clear-board", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✓ Successfully deleted ${data.deletedCount} items`);
      } else {
        setMessage(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`✗ Failed to clear board: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Board Management
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Clear board items from the board-v25 API. This will delete items
            with IDs starting with 'enhanced', 'item', or 'doctor-note'
            (excluding 'raw' and 'single-encounter' items).
          </p>

          <button
            onClick={handleClearBoard}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-white transition-colors hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed md:w-[200px]"
          >
            {loading ? "Clearing..." : "Clear Board Items"}
          </button>

          {message && (
            <p
              className={`text-sm ${
                message.startsWith("✓")
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

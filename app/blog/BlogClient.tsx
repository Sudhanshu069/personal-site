"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { format } from "date-fns";

type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

export default function BlogClient({ posts }: { posts: BlogPostMeta[] }) {
  const [filter, setFilter] = useState("");

  const filteredPosts = useMemo(() => {
    const term = filter.toLowerCase().trim();
    if (!term) return posts;

    return posts.filter((p) => {
      return (
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    });
  }, [filter, posts]);

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-mocha-mauve mb-2">Blog</h1>
          <p className="text-mocha-subtext">
            Thoughts, tutorials, and rants about software engineering.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search posts..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-mocha-mantle border border-mocha-surface0 rounded px-4 py-2 pl-10 text-mocha-text focus:border-mocha-blue outline-none"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-mocha-overlay" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-mocha-surface1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          {filteredPosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block border border-mocha-surface0 bg-mocha-mantle/50 rounded-lg p-5 hover:border-mocha-blue transition-all hover:translate-y-[-2px] hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-3 gap-3">
                <h2 className="text-xl font-bold text-mocha-blue group-hover:text-mocha-lavender transition-colors">
                  {p.title}
                </h2>
                <span className="text-xs text-mocha-overlay font-mono self-center whitespace-nowrap">
                  view &gt;
                </span>
              </div>

              <div className="text-xs text-mocha-overlay font-mono mb-3">
                {format(new Date(p.date), "MMM d, yyyy")}
              </div>

              <p className="text-mocha-subtext line-clamp-3">{p.description}</p>
            </Link>
          ))}

          {filteredPosts.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-12 text-mocha-overlay">
              No posts found matching &quot;{filter}&quot;.
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-mocha-surface0 flex justify-between text-sm text-mocha-overlay font-mono">
        <span>Total Posts: {posts.length}</span>
        <Link href="/" className="hover:text-mocha-text hover:underline">
          cd ..
        </Link>
      </div>
    </div>
  );
}


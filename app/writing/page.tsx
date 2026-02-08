import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import { format } from "date-fns";

export default async function WritingPage() {
    const posts = await getAllPosts("posts");

    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-mocha-surface1">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-mocha-mauve mb-2">Writing</h1>
                <p className="text-mocha-subtext">Thoughts, tutorials, and rants about software engineering.</p>
            </div>

            <div className="space-y-6">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/writing/${post.slug}`}
                        className="group block border-l-2 border-mocha-surface0 pl-4 hover:border-mocha-mauve transition-colors"
                    >
                        <h2 className="text-xl font-bold text-mocha-text group-hover:text-mocha-mauve transition-colors">
                            {post.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 mb-2">
                            <span className="text-xs text-mocha-overlay font-mono">
                                {format(new Date(post.date), "MMM d, yyyy")}
                            </span>
                        </div>
                        <p className="text-mocha-subtext line-clamp-2">{post.description}</p>
                    </Link>
                ))}

                {posts.length === 0 && (
                    <p className="text-mocha-overlay">No posts found.</p>
                )}
            </div>
        </div>
    );
}

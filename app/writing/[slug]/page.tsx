import { getPostBySlug } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug, "posts");

    if (!post) {
        notFound();
    }

    const { meta, content } = post;

    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-mocha-surface1">
            <Link href="/writing" className="flex items-center text-mocha-overlay hover:text-mocha-text mb-6 group w-fit">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Writing
            </Link>

            <article className="prose prose-invert prose-mocha max-w-none">
                <h1 className="text-3xl font-bold text-mocha-mauve mb-2">{meta.title}</h1>
                <p className="text-sm text-mocha-subtext mb-8 border-b border-mocha-surface0 pb-4">
                    Published on {meta.date}
                </p>

                <div className="text-mocha-text">
                    {content}
                </div>
            </article>

            <div className="mt-12 pt-6 border-t border-mocha-surface0 text-mocha-subtext text-sm">
                <p>Thanks for reading!</p>
            </div>
        </div>
    );
}

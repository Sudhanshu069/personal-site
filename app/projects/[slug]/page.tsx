import { getPostBySlug } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProjectPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug, "projects");

    if (!post) {
        notFound();
    }

    const { meta, content } = post;

    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-mocha-surface1">
            <Link href="/projects" className="flex items-center text-mocha-overlay hover:text-mocha-text mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
            </Link>

            <article className="prose prose-invert prose-mocha max-w-none">
                <h1 className="text-3xl font-bold text-mocha-mauve mb-2">{meta.title}</h1>
                <div className="flex flex-wrap gap-2 mb-8">
                    {meta.stack?.map((tech: string) => (
                        <span key={tech} className="text-xs px-2 py-1 bg-mocha-surface0 text-mocha-text rounded-md font-mono">
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="text-mocha-text">
                    {content}
                </div>
            </article>

            <div className="mt-12 pt-6 border-t border-mocha-surface0 text-mocha-subtext text-sm">
                <p>Project ID: {meta.slug}</p>
                <p>Last Updated: {meta.date}</p>
            </div>
        </div>
    );
}

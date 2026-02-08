import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";

const root = process.cwd();

export async function getPostBySlug(slug: string, type: "projects" | "posts") {
    const filePath = path.join(root, "content", type, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const source = fs.readFileSync(filePath, "utf8");

    const { content, frontmatter } = await compileMDX<{
        title: string;
        description: string;
        date: string;
        stack?: string[];
    }>({
        source,
        options: { parseFrontmatter: true },
    });

    return {
        meta: { ...frontmatter, slug },
        content,
    };
}

export async function getAllPosts(type: "projects" | "posts") {
    const contentDir = path.join(root, "content", type);

    if (!fs.existsSync(contentDir)) {
        return [];
    }

    const files = fs.readdirSync(contentDir);

    const posts = await Promise.all(
        files.map(async (file) => {
            const slug = file.replace(/\.mdx$/, "");
            const post = await getPostBySlug(slug, type);
            return post?.meta;
        })
    );

    return posts
        .filter((post): post is NonNullable<typeof post> => post !== undefined)
        .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

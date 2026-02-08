import { getAllPosts } from "@/lib/mdx";
import BlogClient from "./BlogClient";

export default async function BlogPage() {
    const posts = await getAllPosts("posts");

    return <BlogClient posts={posts} />;
}


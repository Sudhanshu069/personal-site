import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <AlertTriangle className="w-16 h-16 text-mocha-yellow mb-4" />
            <h1 className="text-4xl font-bold text-mocha-red mb-2">404</h1>
            <h2 className="text-2xl font-bold text-mocha-subtext mb-8">Command Not Found</h2>
            <p className="text-mocha-overlay mb-8">
                The requested URL was not found on this server.
            </p>
            <Link
                href="/"
                className="px-6 py-2 bg-mocha-surface0 hover:bg-mocha-surface1 text-mocha-text rounded-md border border-mocha-surface2 transition-all"
            >
                cd ~
            </Link>
        </div>
    );
}

import { FileText, Download } from "lucide-react";
import Link from "next/link";

export default function ResumePage() {
    return (
        <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="bg-mocha-mantle border border-mocha-surface0 p-8 rounded-xl text-center max-w-md w-full shadow-2xl">
                <div className="w-16 h-16 bg-mocha-surface0 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-mocha-mauve" />
                </div>
                <h1 className="text-2xl font-bold text-mocha-text mb-2">Resume</h1>
                <p className="text-mocha-subtext mb-6">
                    My resume is available for download.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/resume.pdf"
                        target="_blank"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-mocha-blue text-mocha-base font-bold rounded-lg hover:bg-mocha-sapphire transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </Link>

                    <Link
                        href="/"
                        className="block w-full py-3 text-mocha-overlay hover:text-mocha-text text-sm hover:underline"
                    >
                        Back to Terminal
                    </Link>
                </div>
            </div>
        </div>
    );
}

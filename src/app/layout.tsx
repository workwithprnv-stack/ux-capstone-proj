import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "regex",
  description: "A modern research collaboration platform. Search arXiv papers, bookmark discoveries, follow topics, join research groups, and collaborate with researchers worldwide.",
  keywords: ["arxiv", "research", "papers", "collaboration", "science", "machine learning", "AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        {children}
        <footer className="footer">
          <div className="footer-inner">
            <span className="footer-text">© 2026 ResearchHub — Powered by arXiv API</span>
            <ul className="footer-links">
              <li><a href="https://arxiv.org" target="_blank" rel="noopener noreferrer" className="footer-link">arXiv.org</a></li>
              <li><a href="https://info.arxiv.org/help/api/" target="_blank" rel="noopener noreferrer" className="footer-link">API Docs</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a></li>
            </ul>
          </div>
        </footer>
      </body>
    </html>
  );
}

# Terminal Portfolio Website

A modern, terminal-style personal website built with Next.js (App Router), TypeScript, and Tailwind CSS featuring the Catppuccin Mocha theme.

![Terminal Website](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

## ✨ Features

- **Interactive Terminal Shell**: Type commands like `help`, `welcome`, `projects`, `blog`, `about`, `resume`, `contact`, `history`, `clear`
- **Keyboard shortcuts**: `Tab` autocomplete, `↑/↓` history, `Ctrl+l` clear, `Esc` back to `~`
- **Project Showcase**: Filterable project gallery with MDX-powered detail pages
- **Blog**: MDX-based blog with frontmatter support
- **Catppuccin Mocha Theme**: Beautiful dark theme with 21 carefully chosen colors
- **Fully Responsive**: Works seamlessly on mobile and desktop
- **Type-Safe**: Built with TypeScript for reliability
- **SEO Ready**: Proper metadata and semantic HTML
- **Vercel Ready**: Deploy with zero configuration

## 📁 Project Structure

```
mysite/
├── app/              # Next.js pages (App Router)
├── components/       # React components
├── content/          # MDX content (projects & blog posts)
├── data/             # Editable profile & project data
└── lib/              # Utilities
```

## 🎨 Customization

Update these files:
- **Profile**: `data/profile.ts`
- **Projects list** (cards + links): `data/projects.ts`
- **Project details** (MDX): `content/projects/*.mdx`
- **Blog posts** (MDX): `content/posts/*.mdx`
- **Theme/colors**: `app/globals.css`

## 📚 Notes

- **MDX loader**: `lib/mdx.ts`
- **Terminal implementation**: `components/Terminal/Shell.tsx`

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: MDX with next-mdx-remote
- **Icons**: Lucide React
- **Fonts**: IBM Plex Mono (Google Fonts)

## 📄 License

MIT License - feel free to use this for your own portfolio!

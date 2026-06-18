# 🚀 syncQuestra

syncQuestra is a modern, high-performance community-driven Q&A platform built for developers. Similar to Stack Overflow, it enables programmers globally to ask questions, share deep technical knowledge, explore tags/topics, find jobs, and collaborate seamlessly.

---

## 🛠️ Technology Stack

The project leverages a modern web stack tailored for speed, developer experience, and clean design:

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Framework with Turbopack for fast builds and Server-side rendering |
| **React 19** | Dynamic component-driven user interfaces |
| **Tailwind CSS v4** | Modern styling with HSL theme color tokens and animations |
| **TypeScript** | Static typing and compile-time verification |
| **NextAuth.js v5 (Beta)** | Robust authentication (Credentials & Social OAuth) |
| **Base UI / Shadcn UI** | Reusable, accessible UI components (Sheets, Badges, etc.) |
| **Devicons CDN** | Programming language/technology badge icons |
| **Sonner** | Modern, premium toast notifications |
| **Zod + React Hook Form** | Type-safe form validation and state management |

---

## ✨ Features

- 🌓 **Dynamic Theme System**: Sleek light/dark/system mode toggle powered by `next-themes` and Tailwind CSS v4 variables.
- 🔐 **Authentication Flows**: Email credentials and OAuth login/registration forms (integrated with NextAuth).
- 🧭 **Multi-tier Navigation**:
  - **Left Sidebar**: Quick navigation to Home, Community, Collection, Jobs, Tags, Profile, and Ask Question.
  - **Right Sidebar**: Spotlights **Top Questions** and **Popular Tags** with real-time question counts.
  - **Mobile Drawer Navigation**: Collapsible Radix-based Sheet menu for optimal mobile UX.
- 🏷️ **Devicon Badge Mapper**: Component mapper [techMap.ts](file:///e:/application/2026/WPF/syncquestra/constants/techMap.ts) to automatically display relevant developer icons for tech tags (e.g. React, Node.js, TypeScript).

---

## 📂 Project Structure

```bash
syncquestra/
├── app/                  # Next.js App Router root
│   ├── (auth)/           # Authentication routes (Login / Register)
│   ├── (dashboard)/      # Dashboard layouts and views
│   ├── (root)/           # Main application pages (Community, Collection, Jobs, Tags, Profile)
│   ├── api/              # API Route handlers (Auth endpoints)
│   ├── fonts/            # Custom fonts (Space Mono, Share Tech Mono)
│   └── globals.css       # Global stylesheet & Tailwind directives
├── components/           # Reusable UI Components
│   ├── cards/            # Content cards (e.g., CardTags)
│   ├── forms/            # Form inputs (Credentials Auth, Social Auth)
│   ├── navigation/       # Navigation panels (Left Sidebar, Right Sidebar, Mobile Menu, Navbar)
│   └── ui/               # Low-level UI primitives (Badge, Sheet)
├── constants/            # Routing structures, mapping lists, and menu items
├── context/              # Context Providers (Theme Context)
├── lib/                  # Helper utilities and CN class merging
├── auth.ts               # NextAuth configuration setup
└── next.config.ts        # Next.js specific configuration
```

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
Ensure you have **Node.js** (v18.x or later) and **npm** installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/ahmed-niaz/syncQuestra.git
cd syncquestra
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add your credentials:
```env
NEXTAUTH_SECRET=your_auth_secret_here
# Add developer credentials/OAuth configurations here
```

### 4. Running the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production
To build a production bundle and run the static page optimization:
```bash
npm run build
npm run start
```

---

## 🧹 Code Quality & Linting

We enforce strict linting and code formatting guidelines via ESLint and Prettier.

To run the linter check:
```bash
npm run lint
```

To auto-fix style and indentation issues:
```bash
npx eslint . --fix
```
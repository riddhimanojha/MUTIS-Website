  # MUTIS Website — Frontend

  React + TypeScript frontend for the Manchester University Trading & Investment Society website.

  ## Tech Stack

  - **React 18** with TypeScript
  - **Vite** for development and builds
  - **Tailwind CSS v4** for styling
  - **React Router** for client-side navigation
  - **shadcn/ui** component library

  ## Getting Started

  ```bash
  pnpm install
  pnpm run dev
  ```

  ## Project Structure

  ```
  src/
  ├── main.tsx              # App entry point
  ├── app/
  │   ├── App.tsx           # Root component
  │   ├── routes.tsx        # Route definitions
  │   ├── components/       # Shared components
  │   │   ├── Header.tsx
  │   │   ├── Footer.tsx
  │   │   └── ui/           # shadcn/ui primitives
  │   └── pages/            # Route pages
  │       ├── Home.tsx
  │       ├── About.tsx
  │       ├── Events.tsx
  │       ├── Sponsors.tsx
  │       ├── Alumni.tsx
  │       ├── Join.tsx
  │       └── MEIF.tsx
  └── styles/               # Global styles and theme
  ```
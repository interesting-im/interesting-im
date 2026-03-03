# interesting.im

A TanStack Start application for reading with vocabulary and coin system.

## Features

- ⚡️ **TanStack Start** - Full-stack React framework
- 🛣️ **TanStack Router** - Type-safe routing
- 🔥 **Vite** - Fast development and building
- 📦 **Vinxi** - Universal dev server

## Getting Started

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

## Project Structure

```
app/
├── client.tsx         # Client entry point
├── ssr.tsx            # Server-side rendering entry
├── router.tsx         # Router configuration
├── routeTree.gen.ts   # Auto-generated route tree
├── components/        # Shared components
└── routes/            # Route components
    ├── __root.tsx     # Root layout
    ├── index.tsx      # Home page
    └── about.tsx      # About page
```

## Development

Routes are automatically generated from files in the `app/routes/` directory.


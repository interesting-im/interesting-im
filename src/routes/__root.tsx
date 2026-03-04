import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import '../styles.css'
import { Button } from '~/components/ui/button'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-background dark">
      <nav className="border-b bg-card dark:bg-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex gap-4 items-center">
          <Link to="/">
            {({ isActive }) => (
              <Button variant={isActive ? "default" : "ghost"} size="sm">
                Home
              </Button>
            )}
          </Link>
          <Link to="/about">
            {({ isActive }) => (
              <Button variant={isActive ? "default" : "ghost"} size="sm">
                About
              </Button>
            )}
          </Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

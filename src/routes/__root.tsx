import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import '../styles.css'
import { Button } from '~/components/ui/button'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200">
      <nav className="border-b border-neutral-700 bg-neutral-800 px-4 md:px-8">
        <div className="flex gap-6 items-center">
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
      <main className="w-full px-4 md:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

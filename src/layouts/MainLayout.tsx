import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Compass, Map, User, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MainLayout() {
  const location = useLocation()
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Compass, label: 'Explore', path: '/search' },
    { icon: PlusCircle, label: 'Create', path: '/trips/create' },
    { icon: Map, label: 'My Trips', path: '/trips' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  // Hide nav on landing page
  if (location.pathname === '/') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold tracking-tight">Traveloop</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link to="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Features</Link>

              <Link to="/dashboard" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap">
                Get Started
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card px-4 py-6">
        <Link to="/" className="flex items-center space-x-2 mb-10 px-2">
          <Compass className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold tracking-tight">Traveloop</span>
        </Link>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-accent/10 text-accent" 
                  : "text-muted-foreground hover:bg-accent/5 hover:text-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          {/* Removed Pricing/Pro Plan upgrade card */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full border-t bg-card/80 backdrop-blur-md pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs transition-colors",
                location.pathname === item.path 
                  ? "text-accent" 
                  : "text-muted-foreground hover:text-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

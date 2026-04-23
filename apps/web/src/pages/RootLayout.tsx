import { Link, Outlet } from "@tanstack/react-router";

export function RootLayout() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <nav className="flex gap-4">
          <Link 
            to="/" 
            className="text-muted-foreground font-semibold no-underline transition-colors hover:text-foreground [&.active]:text-primary"
          >
            Главная
          </Link>
          <Link 
            to="/generation"
            className="text-muted-foreground font-semibold no-underline transition-colors hover:text-foreground [&.active]:text-primary"
          >
            Генерация
          </Link>
        </nav>
      </header>
      <main className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
        <Outlet />
      </main>
    </div>
  )
}

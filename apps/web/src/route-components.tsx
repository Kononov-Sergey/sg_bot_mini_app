import { Link, Outlet } from '@tanstack/react-router'

export function RootLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="app-nav">
          <Link to="/">Главная</Link>
          <Link to="/about">О проекте</Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export function AboutPage() {
  return (
    <section>
      <h1>О проекте</h1>
      <p>Маршрутизация работает через TanStack Router.</p>
    </section>
  )
}

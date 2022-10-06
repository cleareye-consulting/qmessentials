import { ReactNode } from 'react'

export default function NavBar({ children }: { children: ReactNode }) {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">{children}</div>
    </nav>
  )
}

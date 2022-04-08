import { ReactNode } from 'react'

export default function NavBarMainMenu({ children }: { children: ReactNode }) {
  return <ul className="navbar-nav me-right mb-2 mb-lg-0">{children}</ul>
}

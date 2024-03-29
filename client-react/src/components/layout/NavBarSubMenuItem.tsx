import { ReactNode, useContext } from 'react'
import { Link } from 'react-router-dom'
import { NavBarContext } from './NavBarProvider'

export interface NavBarSubMenuItemProps {
  to: string
  children: ReactNode
}

export default function NavBarSubMenuItem({ to, children }: NavBarSubMenuItemProps) {
  const { setExpandedItem } = useContext(NavBarContext)
  return (
    <li>
      <Link className={'dropdown-item'} to={to} onClick={() => setExpandedItem('')}>
        {children}
      </Link>
    </li>
  )
}

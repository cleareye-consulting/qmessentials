import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { NavBarContext } from './NavBarProvider'

export default function NavBarSubMenuItem({ to, children }) {
  const { setExpandedItem } = useContext(NavBarContext)
  return (
    <li>
      <Link className={'dropdown-item'} to={to} onClick={() => setExpandedItem('')}>
        {children}
      </Link>
    </li>
  )
}

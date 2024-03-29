import { ReactNode, useContext } from 'react'
import { NavBarContext } from './NavBarProvider'

export interface NavBarSubMenuProps {
  text: string
  children: ReactNode
}

export default function NavBarSubMenu({ text, children }: NavBarSubMenuProps) {
  const { hoveredItem, setHoveredItem, expandedItem, setExpandedItem } = useContext(NavBarContext)

  return (
    <li className="nav-item dropdown">
      <span
        className="nav-link dropdown-toggle"
        onMouseOver={() => setHoveredItem(text)}
        onMouseOut={() => setHoveredItem('')}
        style={{ cursor: hoveredItem === text ? 'pointer' : 'default' }}
        onClick={() => {
          if (expandedItem === text) {
            setExpandedItem('')
          } else {
            setExpandedItem(text)
          }
        }}
      >
        {text}
      </span>
      <ul className={`dropdown-menu dropdown-menu-right ${expandedItem === text ? 'show' : ''}`}>{children}</ul>
    </li>
  )
}

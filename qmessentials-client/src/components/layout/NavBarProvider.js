import { createContext, useState } from 'react'

const NavBarContext = createContext()

function NavBarProvider({ children }) {
  const [hoveredItem, setHoveredItem] = useState('')
  const [expandedItem, setExpandedItem] = useState('')
  return <NavBarContext.Provider value={{ hoveredItem, setHoveredItem, expandedItem, setExpandedItem }}>{children}</NavBarContext.Provider>
}

export { NavBarProvider, NavBarContext }

import { createContext, ReactNode, useState } from 'react'

export interface NavBarValues {
  hoveredItem: string
  setHoveredItem: (value: string) => void
  expandedItem: string
  setExpandedItem: (value: string) => void
}

const defaultValues: NavBarValues = {
  hoveredItem: '',
  setHoveredItem: () => {},
  expandedItem: '',
  setExpandedItem: () => {},
}

const NavBarContext = createContext<NavBarValues>(defaultValues)

function NavBarProvider({ children }: { children: ReactNode }) {
  const [hoveredItem, setHoveredItem] = useState('')
  const [expandedItem, setExpandedItem] = useState('')
  return <NavBarContext.Provider value={{ hoveredItem, setHoveredItem, expandedItem, setExpandedItem }}>{children}</NavBarContext.Provider>
}

export { NavBarProvider, NavBarContext }

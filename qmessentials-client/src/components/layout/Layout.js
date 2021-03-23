import React from 'react'
import logo from '../../assets/images/qmessentials-logo.svg'
import { AuthState, useAuth } from '../auth/AuthProvider'
import NavBar from './NavBar'
import NavBarBrand from './NavBarBrand'
import NavBarMainMenu from './NavBarMainMenu'
import { NavBarContext, NavBarProvider } from './NavBarProvider'
import NavBarSubMenu from './NavBarSubMenu'
import NavBarSubMenuItem from './NavBarSubMenuItem'

export default function Layout({ children }) {
  const { userInfo, authState } = useAuth()

  return (
    <>
      <NavBarProvider>
        <NavBarContext.Consumer>
          {({ setExpandedItem }) => (
            <>
              <header>
                <NavBar>
                  <NavBarBrand logo={logo} text="QMEssentials" onClick={() => setExpandedItem('')} />
                  <NavBarMainMenu>
                    {authState === AuthState.UserInfoRetrieved ? (
                      <>
                        <NavBarSubMenu text="Admin">
                          <NavBarSubMenuItem to="/auth/users">Users</NavBarSubMenuItem>
                        </NavBarSubMenu>
                        <NavBarSubMenu text="Configuration">
                          <NavBarSubMenuItem to="/configuration/products">Products</NavBarSubMenuItem>
                        </NavBarSubMenu>
                        <NavBarSubMenu text={userInfo.userId}>
                          <NavBarSubMenuItem to="/auth/logout">Log out</NavBarSubMenuItem>
                        </NavBarSubMenu>
                      </>
                    ) : (
                      <></>
                    )}
                  </NavBarMainMenu>
                </NavBar>
              </header>
              <main onClick={() => setExpandedItem('')}>
                <div className="container-fluid">{children}</div>
              </main>
            </>
          )}
        </NavBarContext.Consumer>
      </NavBarProvider>
    </>
  )
}

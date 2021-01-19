import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/qmessentials-logo.svg'

export default function Layout({children}) {
    return (        
        <>
        <header>
            <nav className="navbar">
                <div class="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="logo" height="80"/>
                        <span>QMEssentials</span>
                    </Link>
                </div>
            </nav>            
        </header>
        <main><div className="container-fluid">{children}</div></main>
        <footer><hr /><div className="container-fluid">&copy; 2021 ClearEye Consulting, LLC</div></footer>
        </>
    )
}
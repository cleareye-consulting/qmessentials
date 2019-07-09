import React from 'react'
import AuthContext from './AuthContext';

export default function UserNavItem(props) {
    const { isLoggedIn } = React.useContext(AuthContext);
    return (
        isLoggedIn
            ? (
                <li className="nav-item dropdown">
                    <a id="navbarDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                        UserName<span className="caret"></span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" href="#">
                            Log Out
                        </a>
                    </div>
                </li>
            )
            : (
                <li class="nav-item">
                    <a class="nav-link" href="#">Log In</a>
                </li>

            )
    )
}
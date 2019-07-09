import React from 'react'
import AuthContext from './AuthContext';

export default function UserNavItem(props) {
    const { authToken, setAuthToken } = React.useContext(AuthContext);
    return (
        authToken.length > 0
            ?
            <form className="form-inline my-2 my-lg-0">
                <button className="btn btn-sm btn-outline-light my-2 my-sm-0" type="button" onClick={() => setAuthToken('')}>Log Out</button>
            </form>
            :
            <></>
        
    )
}
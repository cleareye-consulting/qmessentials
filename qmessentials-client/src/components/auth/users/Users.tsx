import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User } from '../../../types'

export default function Users() {
  const [users, setUsers] = useState<User[]>([])

  useEffect((): void | (() => void) => {
    let cancel = false
    ;(async () => {
      const usersFromApi = (await axios.get(`${process.env.REACT_APP_AUTH_SERVICE}/users`)).data
      if (!cancel) {
        setUsers(usersFromApi)
      }
    })()
    return () => (cancel = true)
  }, [])

  return (
    <>
      <h2>Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Given Names</th>
            <th>Family Names</th>
            <th>Email</th>
            <th>Active</th>
            <th>Roles</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td>{u.userId}</td>
              <td>{u.givenNames.join(' ')}</td>
              <td>{u.familyNames.join(' ')}</td>
              <td>{u.emailAddress}</td>
              <td>{u.isActive ? 'Y' : 'N'}</td>
              <td>{u.roles.join('; ')}</td>
              <td>
                <Link to={`/auth/users/${u.userId}/edit`}>edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/auth/users/new">Add a User</Link>
    </>
  )
}

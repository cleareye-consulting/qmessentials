import { useHistory } from 'react-router'
import { useAuth } from './AuthProvider'

export default function Logout() {
  const history = useHistory()
  const { logOut } = useAuth()
  logOut()
  history.push('/')
  return null
}

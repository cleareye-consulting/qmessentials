import { createContext, useContext, useMemo } from 'react'
import { useLocation } from 'react-router'
import { AuthState, useAuth } from './AuthProvider'

const PermissionsContext = createContext()

const Permissions = {
  None: 0,
  Read: 1,
  Write: 2,
  ReadWrite: 3,
}

const permissionRequirements = [
  ['List Users', ['Administrator'], ['Administrator']],
  ['Add User', ['Administrator'], ['Administrator']],
  ['Edit User', ['Administrator'], ['Administrator']],
  ['List Products', ['Administrator', 'Analyst'], ['Administrator', 'Analyst']],
  ['Add Product', ['Administrator', 'Analyst'], ['Administrator', 'Analyst']],
  ['Edit Product', ['Administrator', 'Analyst'], ['Administrator', 'Analyst']],
]

const getSubjectForPath = (path) => {
  if (path === '/') {
    return 'Home'
  }
  const parts = path.split('/').slice(1) //to remove the first element, which will be the empty string preceding the opening slash
  if (parts[0] === 'auth') {
    if (parts[1] === 'users') {
      if (parts.length === 2) {
        return 'List Users'
      }
      if (parts.length === 3 && parts[2] === 'new') {
        return 'Add User'
      }
      if (parts.length === 4 && parts[3] === 'edit') {
        return 'Edit User'
      }
      return null
    }
    return null
  }
  if (parts[0] === 'configuration') {
    if (parts[1] === 'products') {
      if (parts.length === 2) {
        return 'List Products'
      }
      if (parts.length === 3 && parts[2] === 'new') {
        return 'Add Product'
      }
      if (parts.length === 4 && parts[3] === 'edit') {
        return 'Edit Product'
      }
      return null
    }
    return null
  }
  return null
}

function PermissionsProvider({ children }) {
  const { authState, userInfo } = useAuth()
  const { pathname } = useLocation()
  const permissions = useMemo(() => {
    if (authState !== AuthState.UserInfoRetrieved) {
      return { permission: Permissions.None, readRoles: [], writeRoles: [] }
    }
    const subject = getSubjectForPath(pathname)
    const permissionsForSubject = permissionRequirements.find((r) => r[0] === subject)
    if (!permissionsForSubject) {
      return { permission: Permissions.None, readRoles: [], writeRoles: [] }
    }
    const readRoles = permissionsForSubject[1]
    const writeRoles = permissionsForSubject[2]
    const canRead = readRoles.some((r) => userInfo.roles.includes(r))
    const canWrite = writeRoles.some((r) => userInfo.roles.includes(r))
    if (canRead) {
      if (canWrite) {
        return { permission: Permissions.ReadWrite, readRoles, writeRoles }
      }
      return { permission: Permissions.Read, readRoles, writeRoles }
    }
    if (canWrite) {
      return { permission: Permissions.Write, readRoles, writeRoles }
    }
    return { permission: Permissions.None, readRoles, writeRoles }
  }, [authState, userInfo, pathname])

  return (
    <PermissionsContext.Provider value={permissions}>
      {permissions.permission === Permissions.None ? (
        <>
          <h2>Missing Permissions</h2>
          <p>
            <strong>You do not have the required permissions to view this page.</strong>
          </p>
          <p>Roles that can see this page: {permissions.readRoles.length > 0 ? permissions.readRoles.join(', ') : 'None'}</p>
          <p>Roles that can modify this page: {permissions.writeRoles.length > 0 ? permissions.writeRoles.join(', ') : 'None'}</p>
        </>
      ) : (
        children
      )}
    </PermissionsContext.Provider>
  )
}

const usePermissions = () => useContext(PermissionsContext)

export { Permissions, PermissionsProvider, usePermissions }

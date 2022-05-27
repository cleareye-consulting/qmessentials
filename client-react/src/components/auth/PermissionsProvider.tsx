import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useLocation } from 'react-router'
import { AuthState, useAuth } from './AuthProvider'

enum Permissions {
  None = 0,
  View = 1,
  Edit = 2,
  Add = 4,
  ViewAndEdit = View | Edit,
  ViewAndAdd = View | Add,
  EditAndAdd = Edit | Add,
  FullPermissions = View | Edit | Add,
}

const permissionRequirements: [string, string[], string[], string[]][] = [
  ['General', ['Administrator', 'Analyst', 'Tester'], [], []],
  ['User', ['Administrator'], ['Administrator'], ['Administrator']],
  ['Product', ['Administrator', 'Analyst', 'Tester'], ['Administrator', 'Analyst'], ['Administrator', 'Analyst']],
]

const getSubjectForPath = (path: string) => {
  if (path === '/') {
    return 'General'
  }
  if (path === '/auth/logout') {
    return 'General'
  }
  if (/^\/auth\/users(?:\/|$)/.test(path)) {
    return 'User'
  }
  const configMatch = /^\/configuration(\/.*)/.exec(path)
  if (configMatch) {
    if (/^\/products(?:\/|$)/.test(configMatch[1])) {
      return 'Product'
    }
  }
  return null
}

export interface PermissionsContextInfo {
  permission: Permissions
  listRoles: string[]
  editRoles: string[]
  addRoles: string[]
}

const PermissionsContext = createContext<PermissionsContextInfo>({
  permission: Permissions.None,
  listRoles: [],
  editRoles: [],
  addRoles: [],
})

function PermissionsProvider({ children }: { children: ReactNode }) {
  const { authState, userInfo } = useAuth()
  const { pathname } = useLocation()
  const permissions = useMemo((): PermissionsContextInfo => {
    if (authState !== AuthState.UserInfoRetrieved) {
      return { permission: Permissions.None, listRoles: [], editRoles: [], addRoles: [] }
    }
    const subject = getSubjectForPath(pathname)
    const permissionsForSubject = permissionRequirements.find((r) => r[0] === subject)
    if (!permissionsForSubject) {
      return { permission: Permissions.None, listRoles: [], editRoles: [], addRoles: [] }
    }
    const listRoles = permissionsForSubject[1]
    const editRoles = permissionsForSubject[2]
    const addRoles = permissionsForSubject[3]
    const canList = listRoles.some((r) => userInfo.roles.includes(r))
    const canEdit = editRoles.some((r) => userInfo.roles.includes(r))
    const canAdd = addRoles.some((r) => userInfo.roles.includes(r))
    let rv = Permissions.None
    if (canList) {
      rv |= Permissions.View
    }
    if (canEdit) {
      rv |= Permissions.Edit
    }
    if (canAdd) {
      rv |= Permissions.Add
    }
    return { permission: rv, listRoles, editRoles, addRoles }
  }, [authState, userInfo, pathname])

  return (
    <PermissionsContext.Provider value={permissions}>
      {permissions.permission === Permissions.None ? (
        <>
          <h2>Missing Permissions</h2>
          <p>
            <strong>You do not have the required permissions to view this page.</strong>
          </p>
          <p>Roles that can see this page: {permissions.listRoles.length > 0 ? permissions.listRoles.join(', ') : 'None'}</p>
          <p>Roles that can modify this page: {permissions.editRoles.length > 0 ? permissions.editRoles.join(', ') : 'None'}</p>
        </>
      ) : (
        children
      )}
    </PermissionsContext.Provider>
  )
}

const usePermissions = () => useContext(PermissionsContext)

export { Permissions, PermissionsProvider, usePermissions }

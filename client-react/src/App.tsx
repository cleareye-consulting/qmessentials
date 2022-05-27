import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.scss'
import { AuthProvider, AuthContext, AuthState } from './components/auth/AuthProvider'
import { PermissionsProvider } from './components/auth/PermissionsProvider'
import EditUser from './components/auth/users/EditUser'
import NewUser from './components/auth/users/NewUser'
import Users from './components/auth/users/Users'
import EditProduct from './components/configuration/product/EditProduct'
import ViewProduct from './components/configuration/product/ViewProduct'
import NewProduct from './components/configuration/product/NewProduct'
import Products from './components/configuration/product/Products'
import Home from './components/Home'
import Layout from './components/layout/Layout'
import Logout from './components/auth/Logout'
import Login from './components/auth/Login'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <AuthContext.Consumer>
            {({ authState }) =>
              authState === AuthState.UserInfoRetrieved ? (
                <PermissionsProvider>
                  <Switch>
                    <Route path="/configuration/products/new" component={NewProduct} />
                    <Route path="/configuration/products/:productId/edit" component={EditProduct} />
                    <Route path="/configuration/products/:productId/view" component={ViewProduct} />
                    <Route path="/configuration/products" component={Products} />
                    <Route path="/auth/users/new" component={NewUser} />
                    <Route path="/auth/users/:userId/edit" component={EditUser} />
                    <Route path="/auth/users" component={Users} />
                    <Route path="/auth/logout" component={Logout} />
                    <Route path="/" component={Home} />
                  </Switch>
                </PermissionsProvider>
              ) : (
                <Login />
              )
            }
          </AuthContext.Consumer>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

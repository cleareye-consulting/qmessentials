import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.scss'
import { AuthProvider } from './components/auth/AuthProvider'
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

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AuthProvider>
          <PermissionsProvider>
            <Switch>
              <Route path="/configuration/products/new" component={NewProduct} />
              <Route path="/configuration/products/:productId/edit" component={EditProduct} />
              <Route path="/configuration/products/:productId/view" component={ViewProduct} />
              <Route path="/configuration/products" component={Products} />
              <Route path="/auth/users/new" component={NewUser} />
              <Route path="/auth/users/:userId/edit" component={EditUser} />
              <Route path="/auth/users" component={Users} />
              <Route path="/" component={Home} />
            </Switch>
          </PermissionsProvider>
        </AuthProvider>
      </Layout>
    </BrowserRouter>
  )
}

export default App

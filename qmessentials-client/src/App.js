import { BrowserRouter, Route } from 'react-router-dom'
import './App.scss'
import { AuthProvider } from './components/auth/AuthContext'
import EditUser from './components/auth/users/EditUser'
import NewUser from './components/auth/users/NewUser'
import Users from './components/auth/users/Users'
import EditProduct from './components/configuration/product/EditProduct'
import NewProduct from './components/configuration/product/NewProduct'
import Products from './components/configuration/product/Products'
import Home from './components/Home'
import Layout from './components/layout/Layout'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AuthProvider>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/configuration/products">
            <Products />
          </Route>
          <Route exact path="/configuration/products/new">
            <NewProduct />
          </Route>
          <Route exact path="/configuration/products/:productId/edit">
            <EditProduct />
          </Route>
          <Route exact path="/auth/users">
            <Users />
          </Route>
          <Route exact path="/auth/users/new">
            <NewUser />
          </Route>
          <Route exact path="/auth/users/:userId/edit">
            <EditUser />
          </Route>
        </AuthProvider>
      </Layout>
    </BrowserRouter>
  )
}

export default App

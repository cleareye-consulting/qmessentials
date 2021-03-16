
import { BrowserRouter, Route } from 'react-router-dom'
import './App.scss'
import NewProduct from './components/configuration/product/NewProduct'
import Products from './components/configuration/product/Products'
import Home from './components/Home'
import Layout from './components/layout/Layout'

function App() {
  return (
    <BrowserRouter>       
      <Layout>
         
       
          <Route exact path="/">
            <Home/>
          </Route>
          <Route exact path="/configuration/products">
            <Products/>             
          </Route>
          <Route exact path="/configuration/products/new">
            <NewProduct/>
          </Route>       
      </Layout>
      </BrowserRouter>
    
  );
}

export default App;

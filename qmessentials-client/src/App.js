
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.scss'
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
          <Route path="/configuration/products">
            <Products/>             
          </Route>
        
       
      </Layout>
      </BrowserRouter>
    
  );
}

export default App;

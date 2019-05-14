import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './Home'
import MetricEditor from './MetricEditor'
import Metrics from './Metrics'
import './App.scss'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Route path="/" exact component={Home} />
          <Route path="/metrics" exact component={Metrics} />
          <Route path="/metric/:name?" exact component={MetricEditor}/>
        </Layout>
      </BrowserRouter>
    )
  }
};

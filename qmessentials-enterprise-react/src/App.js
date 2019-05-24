
import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import MetricsList from './components/metrics/List'
import MetricsEdit from './components/metrics/Edit'
import './App.scss'
import Login from './components/auth/Login';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Route path="/login" exact component={Login}/>
          <Route path="/" exact component={Home} />
          <Route path="/metrics" exact component={MetricsList} />
          <Route path="/metric/:id?" exact component={MetricsEdit}/>
        </Layout>
      </BrowserRouter>
    )
  }
};
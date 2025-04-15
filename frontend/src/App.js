import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import MultiSigPage from './pages/MultiSigPage';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="app-layout">
        <Content className="app-content">
          <Switch>
            <Route path="/" exact component={MultiSigPage} />
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;

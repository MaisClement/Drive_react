import React from 'react';
import ReactDOM from 'react-dom';
import Explorer from './Explorer';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

import './css/color.css';
import './css/App.css';
import './css/Header.css';
import './css/Explorer.css';

function Header() {
  return (
    <header>
      <div style={{ width: '100px' }}>
        <a href="https://drive.hackernwar.com/">
          <img
            src="https://drive.hackernwar.com/view/img/ftp.png"
            alt="Logo"
          />
        </a>
        <span className='title'>Drive</span>
      </div>

      <div style={{ width: '120px' }}>
        <img src="https://drive.hackernwar.com/view/img/menu.png" className="menu" onclick="show_info()" />
      </div>
    </header>

  );
}

function App() {
  const location = useLocation();

  return (
    <Drive
      path={location.pathname.substring(1)}
    />
  )
}

class Drive extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      path: "",
      tree: [],
      files: [],
      base_url: "https://drive.hackernwar.com/?ctrl=",

      error: null,
      error_message: null
    }

    this.getFiles = this.getFiles.bind(this);
  }

  componentDidMount() {
    this.getFiles(this.props.path);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) {  
      this.getFiles(this.props.path);
    }
  }

  getFiles(path) {
    const url = this.state.base_url + "get_file&p=" + path;

    this.setState({
      isLoading: true,
    });

    fetch(url, {
      method: 'get'
    })
      .then(res => res.json())
      .then(data => {

        this.setState({
          path: data.path,
          files: data.files,
          isLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          error: '429',
          error_message: 'Récupération des fichiers impossible.'
        });
      });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Explorer
          path={this.state.path}
          files={this.state.files}
          isLoading={this.state.isLoading}
        />
      </div>
    );
  }
}

export default App;

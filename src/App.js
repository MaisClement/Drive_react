import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Explorer from './Explorer';
import { useLocation, useHistory, Link, Navigate } from "react-router-dom";
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

  const [path, setPath] = useState("/");

  React.useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  return (
    <Drive
      path={path}
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
      base_url: "https://drive.hackernwar.com/",

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
    console.log(window.location.pathname);
  }

  getFiles(path) {
    const url = this.state.base_url + "get_files.php?p=" + path;

    this.setState({
      isLoading: true,
    });

    fetch(url, {
      method: 'get'
    })
      .then(res => res.json())
      .then(data => {

        const temp_path = data.path;
        this.setState({
          path: temp_path[0] === "/" ? temp_path.substring(1) : temp_path,
          files: data.files,
          isLoading: false,
        });

        // https://reactrouter.com/en/main/hooks/use-navigate
        
        // if (window.location.pathname == "/")
        //   window.history.pushState("", "", data.path);
        //   const history = useHistory();
        //   history.push(data.path)
        
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
          tree={this.state.tree}
          isLoading={this.state.isLoading}
          getFiles = {this.getFiles}
        />
      </div>
    );
  }
}

export default App;

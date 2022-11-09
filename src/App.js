import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Explorer from './Explorer';
import { useLocation, useNavigate } from "react-router-dom";
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

function Drive () {
  const location = useLocation();
  const history = useNavigate();

  const [path, setPath] = useState("/");
  const [isLoading, setIsLoading] = useState(false);
  const [tree, setTree] = useState([]);
  const [files, setFiles] = useState([]);
  const base_url = "https://drive.hackernwar.com/";

  React.useEffect(() => {
    if (path !== location.pathname) {
      setPath(location.pathname);
      getFiles(path);
    }
  }, [location]);

  React.useEffect(() => {
    getFiles(path);
  },[]);

  async function getFiles(path) {
    const url = base_url + "get_files.php?p=" + path;

    setIsLoading(true);

    fetch(url, {
      method: 'get'
    })
      .then(res => res.json())
      .then(data => {

        const temp_path = data.path;
        
        setPath(temp_path[0] === "/" ? temp_path.substring(1) : temp_path);
        setFiles(data.files);
        setIsLoading(false);

        Nav(data.path);
        
      })
      .catch(err => {
        // 
      });
  }

  // history('/home');

  return (
    <div className="App">
      <Header />
      <Explorer
        path={path}
        files={files}
        tree={tree}
        isLoading={isLoading}
        getFiles = {getFiles}
      />
    </div>
  );

}



function Nav (url) {
  const navigate = useNavigate();

  navigate(url, {replace: true});
}

export default App;

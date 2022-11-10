import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Explorer from './Explorer';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import he from 'he';

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
  const navigate = useNavigate();

  const [path, setPath] = useState("/");
  const [isLoading, setIsLoading] = useState(false);
  const [tree, setTree] = useState([]);
  const [files, setFiles] = useState([]);
  const base_url = "https://drive.hackernwar.com/";

  React.useEffect(() => {
    if (path !== location.pathname) {
      getFiles(location.pathname);
    }
  }, [location]);

  React.useEffect(() => {
    getFiles(path);
    getFolder(path);
  },[]);

  function getFiles(path) {
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

        if (decodeURIComponent(location.pathname).replace("/", "") != decodeURIComponent(data.path)){
          navigate(data.path);
        }
      })
      .catch(err => {
        // 
      });
  }

  function getFolder(path, id = 0) {
    const url = base_url + "get_folder.php?p=" + path + "&id=" + id;
    fetch(url, {
      method: 'get'
    })
      .then(res => res.json())
      .then(data => {
        setTree(data.files);
      })
      .catch(err => {
        // 
      });
  }

  function updateFiles () {
    getFiles(location.pathname)
  }
  

  return (
    <div className="App">
      <Header />
      <Explorer
        path={path}
        files={files}
        tree={tree}
        isLoading={isLoading}
        getFiles = {getFiles}
        updateFiles = {updateFiles}
      />
    </div>
  );
}


export default App;

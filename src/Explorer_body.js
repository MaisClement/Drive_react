import React from 'react';
import ReactDOM from 'react-dom';
import Files_table from './Files_table';
import { Link, useNavigate } from "react-router-dom";


import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

import update from './img/update.svg';
import add_folder from './img/add-folder.svg';
import upload from './img/upload.svg';

import back from './img/back.svg';
import right from './img/right.svg';

function Path(props) {
  const path = props.path.split('/');
  return (
    <div className="path">
      <Link to={"./"} className="path-link">
        Accueil
      </Link>
      {
        props.path !== ""
          ? <>
            {path.map((p, i) => (
              <>
                <span className="path-space">{'>'}</span>
                <Link to={props.path.substring(0, props.path.indexOf(p) + p.length + 1)} className="path-link">
                  {p}
                </Link>
              </>
            ))}
          </>
          : null
      }
    </div>
  );
}

function ExplorerBody(props) {
  const navigate = useNavigate();

  return (
    <section>

      <div className="options" style={{ display: 'inline-block' }}>
        <div className="small_fluent_btn">
          <img className="svg" src={add_folder} />
        </div>
        <div className="small_fluent_btn">
          <img className="svg" src={upload} />
          <i id="loader3" className="loader-3" />
        </div>
      </div>

      <div className='nav'>
        <div className="small_fluent_btn" onClick={() => navigate(-1)}>
          <img className="svg" src={back} />
        </div>
        
        <div className="small_fluent_btn" onClick={() => navigate(1)}>
          <img className="svg" src={right} />
        </div>
        <div className="small_fluent_btn" onClick={() => props.updateFiles()}>
          <img className="svg" src={update} />
        </div>

        <Path
          path={props.path}
        />
      </div>

      <div className="explorer-space"></div>
      <i className={props.isLoading ? 'loader-4' : 'loader-4 is-hidden'}></i>

      <div className='files'>
        <Files_table
          files={props.files}
          path={props.path}
          onRowSelectStateChange={props.setSelectedRowIds}
          onClickFile = {props.onClickFile}
        />
      </div>

    </section>
  );
};

export default ExplorerBody;
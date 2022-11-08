import { SpinnerCircular } from 'spinners-react';

import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

import settings from './img/settings.svg';
import database from './img/database.svg';

function ExplorerPane() {
  return (
    <div className='pane'>

      <SpinnerCircular size={50} thickness={100} speed={100} color="rgba(130, 2, 130, 1)" secondaryColor="rgba(18, 18, 18, 1)" />

      <div className='pane-container'>
        pane 1
      </div>

      <div className='footer'></div>

      <button className='pane-el'>
        <img
          src={settings}
          className='svg'
          alt="Paramètres"
        />
        <span>Paramètres</span>
      </button>

      <button className='pane-el'>
        <img
          src={database}
          className='svg'
          alt="Stockage"
        />
        <span>Stockage • 92 Go</span>
      </button>

    </div>
  );
};

export default ExplorerPane;


import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

import settings from './img/settings.svg';
import database from './img/database.svg';

function ExplorerPane() {
  return (
    <div className='pane'>

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


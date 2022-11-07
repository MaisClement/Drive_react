import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

import update from './img/update.svg';
import add_folder from './img/add-folder.svg';
import upload from './img/upload.svg';

import back from './img/back.svg';
import right from './img/right.svg';

function ExplorerBody() {
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

      <div>
        <div className="small_fluent_btn">
          <img className="svg" src={back} />
        </div>
        <div className="small_fluent_btn">
          <img className="svg" src={right} />
        </div>
        <div className="small_fluent_btn">
          <img className="svg" src={update} />
        </div>

        <div className="small_fluent_btn path">
          <a className="path-link">Accueil</a>
        </div>

      </div>

    </section>

  );
};

export default ExplorerBody;


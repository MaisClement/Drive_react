import React from 'react';
import ReactDOM from 'react-dom';
import Explorer from './Explorer';
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

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      path: "",
      tree: [],
      files: [],
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Explorer />
      </div>
    );
  }
}

export default App;

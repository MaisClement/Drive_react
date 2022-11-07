import { useState } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import ExplorerPane from './Explorer_pane';
import ExplorerBody from './Explorer_body';
import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

function Explorer() {
  const [sizes, setSizes] = useState([
    100,
    '30%',
    'auto',
  ]);

  const layoutCSS = {
    height: '100%',
    display: 'flex',
  };

  return (
    <div className='explorer'>
      <SplitPane
        split='vertical'
        sizes={sizes}
        onChange={setSizes}
      >
        <Pane minSize={50} maxSize='50%'>
          <ExplorerPane />
        </Pane>

        <ExplorerBody />
      </SplitPane>
    </div>
  );
};

export default Explorer;


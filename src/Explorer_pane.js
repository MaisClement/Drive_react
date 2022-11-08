import { SpinnerCircularFixed } from 'spinners-react';
import TreeView, { flattenTree } from "react-accessible-treeview";

import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

import settings from './img/settings.svg';
import database from './img/database.svg';

const folder = {
  name: "",
  children: [
    {
      name: "src",
      children: [{ name: "index.js" }, { name: "styles.css" }],
    },
    {
      name: "node_modules",
      children: [
        {
          name: "react-accessible-treeview",
          children: [{ name: "bundle.js" }],
        },
        { name: "react", children: [{ name: "bundle.js" }] },
      ],
    },
    {
      name: ".npmignore",
    },
    {
      name: "package.json",
    },
    {
      name: "webpack.config.js",
    },
  ],
};

const data = flattenTree(folder);

const BasicTreeView = () => (
  <TreeView
    data={data}
    className="basic"
    aria-label="basic example tree"
    nodeRenderer={({ element, getNodeProps, level, handleSelect }) => (
      <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
        {element.name}
      </div>
    )}
  />
);


function ExplorerPane(props) {
  return (
    <div className='pane'>

      {
        props.tree == []
          ? <SpinnerCircularFixed size={50} thickness={100} speed={100} color="rgba(130, 2, 130, 1)" secondaryColor="rgba(18, 18, 18, 1)" />
          : <div className='pane-container'>
            <BasicTreeView />
            {
              // https://dgreene1.github.io/react-accessible-treeview/docs/examples-MultiSelectCheckboxAsync
            }
          </div>
      }

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


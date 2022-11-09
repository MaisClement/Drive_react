import { SpinnerCircularFixed } from 'spinners-react';

import React, { useRef, useState } from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import TreeView from "react-accessible-treeview";

import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

import settings from './img/settings.svg';
import database from './img/database.svg';
import folder from './img/folder.png';

const initialData = [
  {
    name: "",
    id: 0,
    children: [1, 2, 3],
    parent: null,
  },
  {
    name: "Fruits",
    children: [],
    id: 1,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Drinks",
    children: [4, 5],
    id: 2,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Vegetables",
    children: [],
    id: 3,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Pine colada",
    children: [],
    id: 4,
    parent: 2,
  },
  {
    name: "Water",
    children: [],
    id: 5,
    parent: 2,
  },
];

function MultiSelectCheckboxAsync() {
  const loadedAlertElement = useRef(null);
  const [data, setData] = useState(initialData);
  const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState([]);

  const updateTreeData = (list, id, children) => {
    const data = list.map((node) => {
      if (node.id === id) {
        node.children = children.map((el) => {
          return el.id;
        });
      }
      return node;
    });
    return data.concat(children);
  };

  const onLoadData = ({ element }) => {
    return new Promise((resolve) => {
      if (element.children.length > 0) {
        resolve();
        return;
      }
      setTimeout(() => {
        setData((value) =>
          updateTreeData(value, element.id, [
            {
              name: `Child Node ${value.length}`,
              children: [],
              id: value.length,
              parent: element.id,
              isBranch: true,
            },
            {
              name: "Another child Node",
              children: [],
              id: value.length + 1,
              parent: element.id,
            },
          ])
        );
        resolve();
      }, 1000);
    });
  };

  const wrappedOnLoadData = async (props) => {
    const nodeHasNoChildData = props.element.children.length === 0;
    const nodeHasAlreadyBeenLoaded = nodesAlreadyLoaded.find(
      (e) => e.id === props.element.id
    );

    await onLoadData(props);

    if (nodeHasNoChildData && !nodeHasAlreadyBeenLoaded) {
      const el = loadedAlertElement.current;
      setNodesAlreadyLoaded([...nodesAlreadyLoaded, props.element]);
      el && (el.innerHTML = `${props.element.name} loaded`);

      // Clearing aria-live region so loaded node alerts no longer appear in DOM
      setTimeout(() => {
        el && (el.innerHTML = "");
      }, 5000);
    }
  };

  return (
    <>
      <div>
        <div className="checkbox">
          <TreeView
            data={data}
            aria-label="Checkbox tree"
            onLoadData={wrappedOnLoadData}
            multiSelect
            propagateSelect
            togglableSelect
            propagateSelectUpwards
            nodeRenderer={({
              element,
              isBranch,
              isExpanded,
              isSelected,
              isHalfSelected,
              getNodeProps,
              level,
              handleSelect,
              handleExpand,
            }) => {
              const branchNode = (isExpanded, element) => {
                return isExpanded && element.children.length === 0 ? (
                  <>
                    <SpinnerCircularFixed size={16} thickness={200} speed={100} color="rgba(130, 2, 130, 1)" secondaryColor="rgba(18, 18, 18, 1)" />
                  </>
                ) : (
                  <ArrowIcon isOpen={isExpanded} />
                );
              };
              return (
                <div
                  {...getNodeProps({ onClick: handleExpand })}
                  style={{ paddingLeft: 15 * (level - 1) }}
                >
                  {isBranch && branchNode(isExpanded, element)}
                  <img src={folder} alt="" />
                  <span className="name">{element.name}</span>
                </div>
              );
            }}
          />
        </div>
      </div>
    </>
  );
}

const ArrowIcon = ({ isOpen }) => {
  return <IoMdArrowDropright style={isOpen ? {"transform":"rotate(90deg)"} : null} className="tree-arrow" />;
};

const CheckBoxIcon = ({ variant, ...rest }) => {
  switch (variant) {
    case "all":
      return <FaCheckSquare {...rest} />;
    case "none":
      return <FaSquare {...rest} />;
    case "some":
      return <FaMinusSquare {...rest} />;
    default:
      return null;
  }
};

function ExplorerPane(props) {
  return (
    <div className='pane'>

      {
        props.tree == []
          ? <SpinnerCircularFixed size={50} thickness={100} speed={100} color="rgba(130, 2, 130, 1)" secondaryColor="rgba(18, 18, 18, 1)" />
          : <div className='pane-container'>
            <MultiSelectCheckboxAsync />
            {
              // BasicTreeView
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


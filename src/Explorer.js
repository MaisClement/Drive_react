import React from 'react';
import { useState } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import { useNavigate, Navigate } from "react-router-dom";

import ExplorerPane from './Explorer_pane';
import ExplorerBody from './Explorer_body';
import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

class Explorer extends React.Component {
  constructor() {
    super();

    this.state = {
      sizes: [30, 100, '100%'],
      selectedRowIds: {}
    }

    this.setSizes = this.setSizes.bind(this);
    this.setSelectedRowIds = this.setSelectedRowIds.bind(this);
    this.onClickFile = this.onClickFile.bind(this);
  }

  setSizes(val) {
    this.setState({
      sizes: val
    })
  }

  setSelectedRowIds(val) {
    this.setState({
      selectedRowIds: val
    })
  }

  onClickFile(row) {
    if (row.original.type == 'folder') {
      if (row.isSelected) {
        this.props.getFiles(`${this.props.path}/${row.original.name}`);
      }
      row.toggleRowSelected();
    }
  }

  render() {
    return (
      <div className='explorer'>
        <SplitPane
          split='vertical'
          sizes={this.state.sizes}
          onChange={this.setSizes}
        >
          <Pane minSize={50} maxSize='50%'>
            
            <ExplorerPane
                  tree={this.props.tree}
                />
          </Pane>

          <ExplorerBody
            path={this.props.path}
            files={this.props.files}
            isLoading={this.props.isLoading}
            setSelectedRowIds={this.setSelectedRowIds}
            onClickFile={this.onClickFile}
            updateFiles={this.props.updateFiles}
          />
        </SplitPane>

        {
          this.state.redirecturl != null
            ? <Navigate to={this.state.redirecturl} replace={true} />
            : null
        }
      </div>
    );
  }
}

export default Explorer;


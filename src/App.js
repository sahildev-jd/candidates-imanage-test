import React, { Component } from 'react';
import './App.css';
import data from './json/data.json';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);

    var cols = data.cols.map((x, idx) => {
      var o = { headerName: x, field: _.camelCase(x) }
      if (idx === 0) {
        o.cellRendererParams = { checkbox: true };
        o.cellRenderer = 'agGroupCellRenderer';
      }

      if (o.headerName.includes('Name') || o.headerName === 'Email') {
        o.sortable = true;
      }

      if (o.headerName === 'WorkedAt') {
        o.filter = true;
      }

      return o;
    });

    this.state = {
      candidates: data,
      allCandidates: {
        columnDefs: cols,
        rowData: data.data.map((x) => {
          let o = {};
          for (let i = 0; i < cols.length; i++) {
            o[cols[i].field] = x[i];
          }
          return o;
        })
      },
      selectedCandidates: {
        columnDefs: cols,
      },
      rowData: [],
      rowSelection: "multiple",
      // defaultColDef: { sortable: true, filter: true }
    }
  }

  handleClick = () => {
    this.setState(prevState => ({
      rowData: prevState.rowData.concat(_.map(this.refs.agGrid1.api.getSelectedNodes(), (rowNode) => { return rowNode.data }))
    }));
  }

  render() {
    return (
      <div className="App">
        <h2>All Candidates</h2>
        <div style={{ height: '350px', width: '100%' }} className="ag-theme-balham" id="allCandidates">
          <AgGridReact ref="agGrid1"
            columnDefs={this.state.allCandidates.columnDefs}
            rowData={this.state.allCandidates.rowData}
            rowSelection={this.state.rowSelection}
            defaultColDef={this.state.defaultColDef}>
          </AgGridReact>
        </div>

        <button onClick={() => { this.handleClick() }}>Select</button>

        <h2>Selected Candidates</h2>
        <div>
          <div style={{ height: '350px', width: '100%' }} className="ag-theme-balham" id="selectedCandidates">
            <AgGridReact ref="agGrid2"
              columnDefs={this.state.selectedCandidates.columnDefs}
              rowData={this.state.rowData}
              defaultColDef={this.state.defaultColDef}>
            </AgGridReact>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

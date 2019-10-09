import React,  { useState, useEffect }  from 'react';
import "./index.scss"

const DataSourceList = (props) => {
  const dataSources = props.dataSources;
  const listDataSources = dataSources.map((dataSource) =>
    <option key={dataSource} value={dataSource}>{dataSource}</option>
  );
  return (
    <div className="datasource-options-container">
      <select onChange={props.selectDataSource} className="select-options">
        {listDataSources}
      </select>
    </div>
  );
}

const SelectedDataSources = (props) => {
  const selectedDataSources = props.selectedDataSources;
  const listSelectedDataSources = selectedDataSources.map((selecteDataSource) =>
    <div className="selected-option" key={selecteDataSource} value={selecteDataSource}>{selecteDataSource}<div className="close-button" onClick={()=> props.deleteDataSource(selecteDataSource)} value={selecteDataSource}>X</div></div>
  );
  return (
    <div>
      {listSelectedDataSources}
    </div>
  );
}


const DataSourceSelector =  (props) => {
  const [availableDataSources, setAvailableDataSources] = useState(props.availableDataSources);
  const [selectedDataSources, setSelectedDataSources] = useState([]);

  useEffect(() => {
      setAvailableDataSources(props.availableDataSources);
  }, [props.availableDataSources])

  const selectDataSource = (dataSource) => {
    let tempSelectedDataSources = [...selectedDataSources];
    if(!tempSelectedDataSources.includes(dataSource.target.value)){
      tempSelectedDataSources.push(dataSource.target.value);
      setSelectedDataSources(tempSelectedDataSources);
      props.updateDataSource(tempSelectedDataSources);
    }
  }

  const deleteDataSource = (dataSource) => {
    console.log(dataSource);
    let tempSelectedDataSources = [...selectedDataSources];
    if(tempSelectedDataSources.includes(dataSource)){
      tempSelectedDataSources.splice(tempSelectedDataSources.indexOf(dataSource), 1);
      setSelectedDataSources(tempSelectedDataSources);
      props.updateDataSource(tempSelectedDataSources);
    }
  }

  return (
    <div id="datasource-selector-container">
      <h2>Datasource</h2>
      <SelectedDataSources selectedDataSources={selectedDataSources} deleteDataSource={deleteDataSource}/>
      <DataSourceList dataSources={availableDataSources} selectDataSource={selectDataSource}/>
    </div>
  );
}

export default DataSourceSelector;

import React,  { useState, useEffect }  from 'react';
import DataSourceSelector from './DataSourceSelector/index';
import CampaignSelector from './CampaignSelector/index';
import DoubleEntryChart from './DoubleEntryChart/index';
import Papa from 'papaparse';
import "./index.scss";
var _ = require('lodash');


const transformDateData = async (data) => {
  let result = await data
    .map((record)=>{
      let date = new Date(record["Date"].replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"))
      record["Date"] = date.getTime();
      return record;
    })
  return result
}

const filterDataSourceCampaign = async (data, datasourceList, campaignList) => {
  let result = await data
    .filter((record)=>{
      let condition =
        (
          ( datasourceList.length === 0 || (datasourceList.includes(record["Datasource"]) && datasourceList.length!==0)) &&
          ( campaignList.length === 0 || (campaignList.includes(record["Campaign"]) && campaignList.length!==0))
        )
      return condition
    })
  return result
}

const compressData = async (data) => {
  // Group by Date
  let dataGrouped =  _.chain(data)
                      .groupBy("Date")
                      .map((value, key) => ({ "Date": key, dataForDate: value }))
                      .value()
  let reducedData = dataGrouped.map((dataGroupedElement)=>{
    let dataForDate = dataGroupedElement["dataForDate"]
    let clicks = dataForDate.map((x) => parseInt(x["Clicks"])).filter((x) => !isNaN(x)).reduce((a,b)=> a+b, 0)
    let impressions = dataForDate.map((x) => parseInt(x["Impressions"])).filter((x) => !isNaN(x)).reduce((a,b)=> a+b, 0)
    return {"Date": parseInt(dataGroupedElement["Date"]), "Clicks": clicks, "Impressions":  impressions}
  })
  return reducedData
}

const getAvailableFilters = async (data, type) => {
  let dataToFilter = data.map((x) => x[type]);
  return dataToFilter.filter((item, pos)=> (dataToFilter.indexOf(item)== pos)).filter((item)=> item !== undefined);
}


const fetchData = async () => {
  const prom = new Promise(function(resolve, reject) {
    Papa.parse("http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv", {
      download: true,
      header: true,
      complete: async (results) => {
        // Transform Dates
        let dataDateTransformed = await transformDateData(results.data);
        // Filter Data
        let initialDatasourceList = [];
        let initialCampaignList = [];
        let dataDateFiltered = await filterDataSourceCampaign(dataDateTransformed, initialDatasourceList, initialCampaignList);
        let compressedData = await compressData(dataDateFiltered);
        let availableDataSources = await getAvailableFilters(dataDateTransformed, "Datasource");
        let availableCampaigns = await getAvailableFilters(dataDateTransformed, "Campaign");
        resolve([compressedData, dataDateTransformed, availableDataSources, availableCampaigns]);
      }
    });
  });
  return await prom.then(value => value);
}

const Viewer =  () => {
  // Available Data
  const [availableData, setAvailableData] = useState([]);
  const [availableDataSources, setAvailableDataSources] = useState([]);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);

  // View Data
  const [currentData, setCurrentData] = useState([]);
  const [currentDataSources, setCurrentDataSources] = useState([]);
  const [currentCampaigns, setCurrentCampaigns] = useState([]);

  useEffect(async () => {
    let result = await fetchData();
    let [currentData, availableData, availableDataSources, availableCampaigns] = [...result]
    setCurrentData(currentData);
    setAvailableData(availableData);
    setAvailableDataSources(availableDataSources);
    setAvailableCampaigns(availableCampaigns);
  },[]);


  const updateDataSource = async (dataSourceArray) => {
    let tempDataSourceArray = [...dataSourceArray];
    let dataDateFiltered = await filterDataSourceCampaign(availableData, tempDataSourceArray, currentCampaigns);
    let compressedData = await compressData(dataDateFiltered);
    setCurrentDataSources(tempDataSourceArray);
    setCurrentData(compressedData);
  }

  const updateCampaign = async (campaignArray) => {
    let tempCampaignArray = [...campaignArray];
    let dataDateFiltered = await filterDataSourceCampaign(availableData, currentDataSources, tempCampaignArray);
    let compressedData = await compressData(dataDateFiltered);
    setCurrentCampaigns(tempCampaignArray);
    setCurrentData(compressedData);
  }

  return (
    <div id="viewer-container">
      <div id="selectors-container">
        <DataSourceSelector updateDataSource={updateDataSource} availableDataSources={availableDataSources} />
        <CampaignSelector updateCampaign={updateCampaign} availableCampaigns={availableCampaigns}/>
      </div>
      <div id="chart-container">
        <DoubleEntryChart data={currentData}/>
      </div>
    </div>
  );
}

export default Viewer;

import React,  { useState, useEffect }  from 'react';
import "./index.scss"

const CampaignSelectorList = (props) => {
  const campaigns = props.campaigns;
  const listCampaigns= campaigns.map((campaign) =>
    <option key={campaign} value={campaign}>{campaign}</option>
  );
  return (
    <div className="campaign-options-container">
      <select onChange={props.selectCampaign} className="select-options">
        {listCampaigns}
      </select>
    </div>
  );
}

const SelectedCampaigns = (props) => {
  const selectedCampaigns = props.selectedCampaigns;
  const listSelectedCampaigns = selectedCampaigns.map((selecteCampaign) =>
    <div className="selected-option" key={selecteCampaign} value={selecteCampaign}>{selecteCampaign}<div className="close-button" onClick={()=>props.deleteCampaign(selecteCampaign)}>X</div></div>
  );
  return (
    <div>
      {listSelectedCampaigns}
    </div>
  );
}

const CampaignSelector =  (props) => {
  const [availableCampaigns, setAvailableCampaigns] = useState(props.availableCampaigns);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  useEffect(() => {
      setAvailableCampaigns(props.availableCampaigns);
  }, [props.availableCampaigns])

  const selectCampaign = (campaign) => {
    let tempSelectedCampaigns = [...selectedCampaigns];
    if(!tempSelectedCampaigns.includes(campaign.target.value)){
      tempSelectedCampaigns.push(campaign.target.value);
      setSelectedCampaigns(tempSelectedCampaigns);
      props.updateCampaign(tempSelectedCampaigns);
    }
  }

  const deleteCampaign = (campaign) => {
    let tempSelectedCampaigns = [...selectedCampaigns];
    if(tempSelectedCampaigns.includes(campaign)){
      tempSelectedCampaigns.splice(tempSelectedCampaigns.indexOf(campaign), 1);
      setSelectedCampaigns(tempSelectedCampaigns);
      props.updateCampaign(tempSelectedCampaigns);
    }
  }

  return (
    <div id="campaign-selector-container">
      <h2>Campaigns</h2>
      <SelectedCampaigns selectedCampaigns={selectedCampaigns} deleteCampaign={deleteCampaign}/>
      <CampaignSelectorList campaigns={availableCampaigns} selectCampaign={selectCampaign}/>
    </div>
  );
}

export default CampaignSelector;

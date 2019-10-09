import React,  { useState, useEffect }  from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';
import moment from 'moment';
import './index.scss';

const formateDate = (timeMilliseconds) => {
  let dateFormatted = moment(timeMilliseconds).format('DD.MMM');
  return dateFormatted;
}

const DoubleEntryChart =  (props) => {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data);
  },[props.data]);

  return (
    <div id="line-chart">
      <LineChart width={900} height={400} data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <Line yAxisId="left" type="linear" dataKey="Clicks" stroke="indigo" />
        <Line yAxisId="right" type="linear" dataKey="Impressions" stroke="magenta" />
        <CartesianGrid stroke="#ccc" />
        <XAxis type="number" dataKey="Date" tickFormatter={formateDate} domain={['auto', 'auto']}/>
        <YAxis yAxisId="left">
          <Label value='Clicks' angle={-90} position='left'/>
        </YAxis>
        <YAxis yAxisId="right" orientation="right">
          <Label value='Impressions' angle={90} position='right'/>
        </YAxis>
        <Tooltip labelFormatter={formateDate}/>
        <Legend />
      </LineChart>
    </div>
  );
}

export default DoubleEntryChart;

import React from 'react'
import { DataGrid } from '@mui/x-data-grid';

import './covid-table.css'

const CovidTable = ({data}) => {

  const columns = [
    {field: "country", headerName: "Country", width: 130 },
    {field: "cases", headerName: "Number of cases", width: 130 },
    {field: "deaths", headerName: "Number of deaths", width: 130 },
    {field: "totalCases", headerName: "Number of cases total", width: 130 },
    {field: "totalDeaths", headerName: "Number of deaths total", width: 130 },
    {field: "casesOnThousands", headerName: "Number of cases per 1000 inhabitants", width: 130 },
    {field: "deathsOnThousands", headerName: "Number of deaths per 1000 inhabitants", width: 130 }
  ]
  const rows = data.map((item, index) => ({
    id: index + 1, // Generate id
    country: item.country,
    cases: item.cases,
    deaths: item.deaths,
    totalCases: item.totalCases,
    totalDeaths: item.totalDeaths,
    casesOnThousands: item.totalCases / 1000,
    deathsOnThousands: item.totalDeaths / 1000
  }));

  const getRowId = (row) => {

    return row.id;
  };

  return (
    <div className='pos'>
      
      <DataGrid 
      style={{width: '100%'}}
      columns={columns}
      rows={rows}
      getRowId={getRowId}
      />
    </div>
);
};


export default CovidTable


//   function generateRandom() {
//     let length = 8,
//         charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
//         retVal = "";
//     for (let i = 0, n = charset.length; i < length; ++i) {
//         retVal += charset.charAt(Math.floor(Math.random() * n));
//     }
//     return retVal;
// } 
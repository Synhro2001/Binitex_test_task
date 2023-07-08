import React from 'react'
import { DataGrid } from '@mui/x-data-grid';

const CovidTable = ({data}) => {

  const columns = [
    {field: "country", name: "Country", width: 130},
    {field: "cases", name: "Number of cases", width: 130},
    {field: "deaths", name: "Number of deaths", width: 130},
    {field: "totalCases", name: "Number of cases total", width: 130},
    {field: "totalDeaths", name: "Number of deaths total", width: 130},
    {field: "casesOnThousands", name: "Number of cases per 1000 inhabitants", width: 130},
    {field: "deathsOnThousands", name: "Number of deaths per 1000 inhabitants", width: 130}
  ]

  const rows = data.map((item) => ({
    id: generateRandom(),
    country: item.country,
    cases: item.cases,
    deaths: item.deaths,
    totalCases: item.totalCases,
    totalDeaths: item.totalDeaths,
    casesOnThousands: item.casesOnThousands,
    deathsOnThousands: item.deathsOnThousands
  }))

  function generateRandom() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

  return (
    <>
      <DataGrid 
      style={{width: '100%'}}
      columns={columns}
      rows={rows}
      headerRowHeight={78}
      rowHeight={30}
      pageSize={2}
      />
    </>
);
};


export default CovidTable

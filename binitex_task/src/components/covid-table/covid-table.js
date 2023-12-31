import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { CiCircleList } from 'react-icons/ci';

import './covid-table.css'

const CovidTable = (
  {
    tableData,
    filterCountry,
    selectedOption,
    minMaxValue,
    handleChangeCountry,
    showMenu,
    options,
    handleFilterValue,
    handleDropDown, 
    setShowMenu
  }) => {

  const columns = [
    {field: "countriesAndTerritories", headerName: "Country", width: 130 },
    {field: "cases", headerName: "Number of cases", width: 130 },
    {field: "deaths", headerName: "Number of deaths", width: 130 },
    {field: "totalCases", headerName: "Number of cases total", width: 130 },
    {field: "totalDeaths", headerName: "Number of deaths total", width: 130 },
    {field: "casesOnThousands", headerName: "Number of cases per 1000 inhabitants", width: 130 },
    {field: "deathsOnThousands", headerName: "Number of deaths per 1000 inhabitants", width: 130 }
  ]
  const rows = tableData.map((item, index) => ({
    id: index + 1, // Generate id
    countriesAndTerritories: item.countriesAndTerritories,
    cases: item.cases,
    deaths: item.deaths,
    totalCases: item.totalCases,
    totalDeaths: item.totalDeaths,
    casesOnThousands: item.totalCases / 1000,
    deathsOnThousands: item.totalDeaths / 1000
  })); // getResult from navbar country input and make filter with used date

  const getRowId = (row) => {
    return row.id;
  };

  const rowsFilter = rows.filter((item) => {
    const isCountryMatched = item.countriesAndTerritories.toLowerCase().includes(filterCountry.toLowerCase());
    const isMinMaxValueMatched = selectedOption
      ? item[selectedOption.value] >= minMaxValue.minValue && item[selectedOption.value] <= minMaxValue.maxValue
      : true; 
  
    return isCountryMatched && isMinMaxValueMatched;
  });

  return (
    <>
     <div className="nav-component">
        <form className='country-search-form'>
          <input 
            type='text'
            placeholder='Search country'
            className='country-input-cover'
            value={filterCountry || ""}
            onChange={(e) => handleChangeCountry(e.target.value)}
          />
          {/* <button className='country-search-btn' >Search</button> */}
        </form>
        <div className="dropdown">
          <div className="dropdown-button" >
            {selectedOption.label || "Choose one option"}
            <span onClick={(e) => setShowMenu(!showMenu)}><CiCircleList/></span>
          </div>
          <div className="dropdown-content">
            {showMenu && 
              options.map((option) => (
                <div onClick={(e) => handleDropDown(option)}   
                key={option.value}
                className="dropdown-item">
                  {option.label}
                </div>
              ))
            }
           
          </div>
        </div>
        <input 
            type='number'
            placeholder='Значение от'
            className='value-input-cover'
            name='minValue'
            value={minMaxValue.minValue}
            onChange={handleFilterValue}
            onKeyPress={(e) => {
              const key = e.key;
              if (isNaN(key) || key === ' ') {
                e.preventDefault();
              }
            }}
          />
        <input 
          type='number'
          placeholder='Значение до'
          className='value-input-cover'
          name="maxValue"
          value={minMaxValue.maxValue}
          onChange={handleFilterValue}
          onKeyPress={(e) => {
            const key = e.key;
            if (isNaN(key) || key === ' ') {
              e.preventDefault();
            }
          }}
        />  
      </div>
      <div className='table-position'> 
      <DataGrid 
      style={{width: '100%'}}
      columns={columns}
      rows={rowsFilter}
      getRowId={getRowId}
      />
    </div>
    </>
 
);
};

export default CovidTable

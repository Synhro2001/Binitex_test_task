import React, { useEffect, useMemo, useState } from 'react'
import CovidService from '../../services/covid-service'
import CovidTable from '../covid-table/covid-table'

import './navbar.css'

const Navbar = () => {

  const covidService = new CovidService()

  const [data, setData] = useState([]) 
  const [filtredData, setfiltredData] = useState([]) 
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [countryInputValue, setCountryInputValue] = useState("")


  // const [datesArr, setDatesArr] = useState([])

  const getData = () => {
    covidService.getCovidData().then((allData) => {
      setData(allData)
    })
  }

  useEffect(() => {
    getData();
  }, []);


  const tableObj = useMemo(() => {
    const totalCases = data.reduce((accumulator, currentItem) => accumulator + currentItem.cases, 0);
    const totalDeaths = data.reduce((accumulator, currentItem) => accumulator + currentItem.deaths, 0);
    
    return data.map((item) => ({
      country: item.countriesAndTerritories,
      ...item,
      totalCases: totalCases,
      totalDeaths: totalDeaths
    }));

  }, [data]);
  
  // Conver date string to Date
  const flipDate = (date) => {
    const dateParts = date.split('/');
    const flippedDate = new Date(dateParts.reverse().join('/'));
    return flippedDate
  };

  // Get dates from obj array
  const getDates = () => {
    const dates = data.map((item) => {
      return flipDate(item.dateRep);
    });
    return  dates;
  };

  // search country input value
  const filtredDataByCountry = (countryInputValue) => {
    const filtredDatabyCountry = tableObj.filter((item) => {
      return (
        countryInputValue &&
        item &&
        item.country &&
        item.country.toLowerCase().includes(countryInputValue) 
      );
    });
    setfiltredData(filtredDatabyCountry)
  }

  const handleChangeCountry = (value) => {
    setCountryInputValue(value);
    filtredDataByCountry(value);
  };
 
  console.log(filtredData)

  console.log(minDate)

  // const minDate = new Date(Math.min.apply(null, getDates()));
  // const maxDate = new Date(Math.max.apply(null, getDates()));

  return (
    <div className="navbar-container">
      <div className="nav-component">
        <button className='button-cover'>Table</button>
        <button className='button-cover'>Info</button>
        <form className='country-search-form'>
          <input 
            type='text'
            placeholder='Search country'
            className='input-cover'
            value={countryInputValue || ""}
            onChange={(e) => handleChangeCountry(e.target.value)}
          />
          <button className='country-search-btn' >Search</button>
        </form>
        
        <input 
          type='text'
          placeholder='Hello world'
          className='input-cover'
        />
      </div>
      <div className='period-container'>
        <span className='period-text-cover'>Period ot</span>
        <input 
          type="date"
          className='period-input-cover'
          value={minDate}
          minDate={'2019-12-31'}
          onInput={(e) => setMinDate(e.target.value)}

        />
        <span className='period-text-cover'>Do</span>
        <input 
          type="date"
          className='period-input-cover'
          value={maxDate}
          maxDate={'2020-12-14'}
          onInput={(e) => setMaxDate(e.target.value)}
        />
      </div>
      <CovidTable
          data = {filtredData} 
        />
   
    </div>
  )
}

export default Navbar

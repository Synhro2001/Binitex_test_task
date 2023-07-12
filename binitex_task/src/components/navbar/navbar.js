import React, { useEffect, useMemo, useState } from 'react'

import DatePicker from 'react-datepicker'

import CovidService from '../../services/covid-service'
import CovidTable from '../covid-table/covid-table'

import './navbar.css'
import './date-picker.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import moment from 'moment/moment'

const Navbar = () => {

  const covidService = new CovidService()

  const [data, setData] = useState([]) 
  const [countryInputValue, setCountryInputValue] = useState("")
  const [startDate, setStartDate] = useState(new Date('2019/12/01'));
  const [endDate, setEndDate] = useState(new Date('2020/08/28'));

  const getData = () => {
    covidService.getCovidData().then((allData) => {
      setData(allData)
    })
  }

  useEffect(() => {
    getData();
  }, []);

  const filteredData = useMemo(() => {
    const totalCases = data.reduce((accumulator, currentItem) => accumulator + currentItem.cases, 0);
    const totalDeaths = data.reduce((accumulator, currentItem) => accumulator + currentItem.deaths, 0);
    
    return data.map((item) => ({
      country: item.countriesAndTerritories,
      ...item,
      totalCases: totalCases,
      totalDeaths: totalDeaths,
    })).filter((item) => {
      return (
        moment(item.dateRep, "DD/MM/YYYY").isSameOrAfter(startDate) &&
        moment(item.dateRep, "DD/MM/YYYY").isSameOrBefore(endDate)
      );
    });
  }, [data, startDate, endDate]);



  const filtredDataByCountry = (countryInputValue) => {
    const filtredDatabyCountry = filteredData.filter((item) => {
      return (
        countryInputValue &&
        item &&
        item.country &&
        item.country.toLowerCase().includes(countryInputValue.toLowerCase()) 
      );
    });
    return (filtredDatabyCountry)

  }

  const handleChangeCountry = (value) => {
    setCountryInputValue(value);
    filtredDataByCountry(value);
  };

  console.log(countryInputValue)
  console.log(filtredDataByCountry)

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
          {/* <button className='country-search-btn' >Search</button> */}
        </form>
        
        <input 
          type='text'
          placeholder='Hello world'
          className='input-cover'
        />
      </div>
      <div style={{ margin: 0}}>
        <DatePicker 
         selectsStart
         selected={startDate}
         onChange={date => setStartDate(date)}
         startDate={startDate}
        />
        
        <DatePicker
          selectsEnd
          selected={endDate}
          onChange={date => setEndDate(date)}
          endDate={endDate}
          startDate={startDate}
          minDate={startDate}
        />
      

      </div>
      <CovidTable
          data = {filteredData} 
          filterCountry = {countryInputValue}
        />
   
    </div>
  )
}

export default Navbar

  // Conver date string to Date
  // const flipDate = (date) => {
  //   const dateParts = date.split('/');
  //   const flippedDate = new Date(dateParts.reverse().join('/'));
  //   return flippedDate
  // };

  // Get dates from obj array
  // const getDates = () => {
  //   const dates = data.map((item) => {
  //     return flipDate(item.dateRep);
  //   });
  //   return  dates;
  // };

  // search country input value
  // add icon X and search icon
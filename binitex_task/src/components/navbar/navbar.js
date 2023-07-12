import React, { useEffect, useMemo, useState } from 'react'

import DatePicker from 'react-datepicker'
import { CiCircleList } from 'react-icons/ci';
import CovidService from '../../services/covid-service'
import CovidTable from '../covid-table/covid-table'

import './navbar.css'
import './date-picker.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import moment from 'moment/moment'

const Navbar = () => {

  const options = [
    { value: "country", label: "Country"},
    { value: "cases", label: "Number of cases"},
    { value: "deaths", label: "Number of deaths"},
    { value: "totalCases", label: "Number of cases total"},
    { value: "totalDeaths", label: "Number of deaths total"},
    { value: "casesOnThousands", label: "Number of cases per 1000 inhabitants"},
    { value: "deathsOnThousands", label: "Number of deaths per 1000 inhabitants"}
  ]

  const covidService = new CovidService()

  const [data, setData] = useState([]) 
  const [countryInputValue, setCountryInputValue] = useState("")
  const [startDate, setStartDate] = useState(new Date('2019/12/01'));
  const [endDate, setEndDate] = useState(new Date('2020/08/28'));
  const [showMenu, setShowMenu] = useState(false);


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

  // Select  filter by value DropDown 

  // useEffect(() => {
  //   const handler = () => setShowMenu(false);

  //   window.addEventListener("click", handler);
  //   return () => {
  //     window.removeEventListener("click", handler)
  //   };
  // });

  // const handleDropDownInputClick = (e) => {
  //   e.stopPropagation();
  //   setShowMenu(!showMenu)
  // };



  console.log(countryInputValue)
  console.log(filtredDataByCountry)

  return (
    <div className="navbar-container">
      <div className="nav-component">
        <form className='country-search-form'>
          <input 
            type='text'
            placeholder='Search country'
            className='country-input-cover'
            value={countryInputValue || ""}
            onChange={(e) => handleChangeCountry(e.target.value)}
          />
          {/* <button className='country-search-btn' >Search</button> */}
        </form>
        <div className="dropdown">
          <div className="dropdown-button" >
            Choose One
            <span onClick={(e) => setShowMenu(!showMenu)}><CiCircleList / ></span>
          </div>
          <div className="dropdown-content">
            {showMenu && 
              options.map((option) => (
                <div key={option.value} className="dropdown-item">
                  {option.label}
                </div>
              ))
            }
           
          </div>
        </div>
        <input 
            type='text'
            placeholder='Значение от'
            className='value-input-cover'
          />
        <input 
          type='text'
          placeholder='Значение до'
          className='value-input-cover'
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
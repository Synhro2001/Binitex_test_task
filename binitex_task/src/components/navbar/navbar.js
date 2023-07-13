import React, { useEffect, useMemo, useState } from 'react'

import DatePicker from 'react-datepicker'
import { CiCircleList } from 'react-icons/ci';
import CovidService from '../../services/covid-service'
import CovidTable from '../covid-table/covid-table'
import CovidGraphic from '../covid-graphic/covid-graphic';

import './navbar.css'
import './date-picker.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import moment from 'moment/moment'

const Navbar = () => {

  const options = [
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
  const [selectedOption, setSelectedOption] = useState("")

  const [minMaxValue, setMinMaxValue] = useState({
    minValue: '',
    maxValue: ''
  })

  const getData = () => {
    covidService.getCovidData().then((allData) => {
      setData(allData)
    })
  }

  useEffect(() => {
    getData();
  }, []);

  const filteredData = useMemo(() => {
    const filteredItems = data.filter((item) => {
      return (
        moment(item.dateRep, "DD/MM/YYYY").isSameOrAfter(startDate) &&
        moment(item.dateRep, "DD/MM/YYYY").isSameOrBefore(endDate)
      );
    });
  
    const totalCases = filteredItems.reduce((accumulator, currentItem) => accumulator + currentItem.cases, 0);
    const totalDeaths = filteredItems.reduce((accumulator, currentItem) => accumulator + currentItem.deaths, 0);
  
    return filteredItems.map((item) => ({
      country: item.countriesAndTerritories,
      ...item,
      totalCases: totalCases,
      totalDeaths: totalDeaths,
    }));
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

  const handleDropDown = (option) => {
    setSelectedOption(option)
    setShowMenu(false);
  }

  const handleFilterValue = (event) => {
    const { name, value } = event.target;
    setMinMaxValue(minMaxFilter => ({
        ...minMaxFilter,
        [name]: value,
    }));
  };

  // Component switcher 

  const [currentComponent, setCurrentComponent] = useState('Table');

  const switchToTable = () => {
    setCurrentComponent('Table');
  };

  const switchToGraphic = () => {
    setCurrentComponent('Graphic');
  };

  const renderComponent = () => {
    if (currentComponent === 'Table') {
      return  <CovidTable
      data = {filteredData} 
      filterCountry = {countryInputValue}
      selectedOption = {selectedOption}
      minMaxValue = {minMaxValue}
    />;
    } else if (currentComponent === 'Graphic') {
      return <CovidGraphic />;
    }
  };

  // Update filter function

  const resetFilters = () => {
    setCountryInputValue('');
    setSelectedOption('');
    setMinMaxValue({ minValue: '', maxValue: '' });
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



  // console.log(selectedOption.label)
  // console.log(minMaxValue.maxValue)

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
          />
        <input 
          type='number'
          placeholder='Значение до'
          className='value-input-cover'
          name="maxValue"
          value={minMaxValue.maxValue}
          onChange={handleFilterValue}
        />
        
      </div>
      <div style={{ marginTop: 50}}>
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
      {renderComponent()}
     
      <div className='component-switcher'>
        <button className='component-switcher-button' onClick={switchToTable}>Table</button>
        <button className='component-switcher-button' onClick={switchToGraphic}>Graphic</button>
        <button onClick={resetFilters}>Reset Filters</button>
      </div>
   
    </div>
  )
}
export default Navbar
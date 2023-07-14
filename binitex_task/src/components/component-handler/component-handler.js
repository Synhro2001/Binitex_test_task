import React, { useEffect, useMemo, useState } from 'react'

import DatePicker from 'react-datepicker'
import CovidService from '../../services/covid-service'
import CovidTable from '../covid-table/covid-table'
import CovidGraphic from '../covid-graphic/covid-graphic';

import './component-handler.css'
import './date-picker.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import moment from 'moment/moment'

const ComponentHandler = () => {

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
        item.countriesAndTerritories &&
        item.countriesAndTerritories.toLowerCase().includes(countryInputValue.toLowerCase()) 
      );
    });
    return (filtredDatabyCountry)

  }

  const handleChangeCountry = (value) => {
    if (!/\d/.test(value)) {
      setCountryInputValue(value);
      filtredDataByCountry(value);
    }
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
      tableData = {filteredData} 
      filterCountry = {countryInputValue}
      selectedOption = {selectedOption}
      minMaxValue = {minMaxValue}
      showMenu = {showMenu}
      options = {options}
      setShowMenu = {setShowMenu}
      handleDropDown = {handleDropDown}
      handleFilterValue = {handleFilterValue}
      handleChangeCountry = {handleChangeCountry}
    />;
    } else if (currentComponent === 'Graphic') {
      return <CovidGraphic
      chartData = {filteredData} 
      />;
    }
  };

  // Update filter function

  const resetFilters = () => {
    setCountryInputValue('');
    setSelectedOption('');
    setMinMaxValue({ minValue: '', maxValue: '' });
  };
  
  return (
    <>
   
      {renderComponent()}
      <div style={{ marginTop: 0}} className='datepicker-container'>
        <DatePicker 
         selectsStart
         selected={startDate}
         onChange={date => setStartDate(date)}
         startDate={startDate}
         className='datepicker-input'
        />
        
        <DatePicker
          selectsEnd
          selected={endDate}
          onChange={date => setEndDate(date)}
          endDate={endDate}
          startDate={startDate}
          minDate={startDate}
          className='datepicker-input'
        />
      
       
      </div>
     
      <div className='component-switcher'>
        <button className='component-switcher-button' onClick={switchToTable}>Table</button>
        <button className='component-switcher-button' onClick={switchToGraphic}>Graphic</button>
        <button className='reset-button' onClick={resetFilters}>Reset Filters</button>
      </div>
  
    </>
      
  )
}
export default ComponentHandler


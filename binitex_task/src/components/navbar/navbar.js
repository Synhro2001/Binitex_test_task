import React, { useEffect, useState } from 'react'
import CovidService from '../../services/covid-service'
import CovidTable from '../covid-table/covid-table'

const Navbar = () => {

  const covidService = new CovidService()

  const [data, setData] = useState([]) 
  // const [datesArr, setDatesArr] = useState([])

  const getData = () => {
    covidService.getCovidData().then((allData) => {
      setData(allData)
    })
  }

  useEffect(() => {
    getData();
  }, []);

  // Conver date string to Date
  const flipDate = (date) => {
    const dateParts = date.split('/');
    const flippedDate = new Date(dateParts.reverse().join('/'));
    return flippedDate
  };

  
  const getDates = () => {
    const dates = data.map((item) => {
      return flipDate(item.dateRep);
    });
    return  dates;
  };

  const minDate = new Date(Math.min.apply(null, getDates()));
  const maxDate = new Date(Math.max.apply(null, getDates()));


  return (
    <div className="navbar-container">
      <div className="nav-component">
        <CovidTable
          data = {data}
        />
      </div>
   
    </div>
  )
}

export default Navbar

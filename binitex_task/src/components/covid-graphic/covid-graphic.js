import React, {useState, useEffect} from 'react'
import { CiCircleList } from 'react-icons/ci';

import { Line } from 'react-chartjs-2'
import 'chart.js/auto';

import "./covid-graphic.css"

const CovidGraphic = ({chartData}) => {

  const [countryMenu, setCountryMenu] = useState(false)
  const [countryArray, setCountryArray] = useState([])
  const [selectedCountry, setSelectedCountry] = useState("")

  const handleCountryMenuDropDown = (countries) => {
    setSelectedCountry(countries)
    setCountryMenu(false);
  }

  useEffect(() => {
    const uniqueCountries = chartData.reduce((accumulator, record) => {
      const foundCountry = accumulator.find((country) => country === record.countriesAndTerritories);
      if (!foundCountry) {
        return [...accumulator, record.countriesAndTerritories];
      }
      return accumulator;
    }, []);
  
    setCountryArray(uniqueCountries);
  }, [chartData]);
  
  console.log(countryArray);




  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3, 8],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.4)',
        fill: false,
    
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
    <div className="dropdown">
      <div className="dropdown-button" >
        {selectedCountry || "Choose one option"}
        <span onClick={(e) => setCountryMenu(!countryMenu)}><CiCircleList/></span>
      </div>
      <div className="dropdown-content scrool-contain">
        { countryMenu && 
          countryArray.map((item) => (
            <div onClick={(e) => handleCountryMenuDropDown(item)}
            key={item}
            className="dropdown-item"
            
            >
               {item}
            </div>
          ))

        }
      </div>
    </div>
    <div className='covid-chart-container' >
      <Line data={data} options={options} />
    </div>
    </>
  
  )
}

export default CovidGraphic

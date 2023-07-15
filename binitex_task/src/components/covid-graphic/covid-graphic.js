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
    
  const getPeriodData = () => {
    return chartData
      .filter((item) => selectedCountry ? item.countriesAndTerritories === selectedCountry : item)
      .reduce((accumulator, countryData) => {
        const { dateRep, cases, deaths } = countryData;
        let index = accumulator.findIndex(obj => obj && obj.date === dateRep);
        
        if (index === -1) {
          accumulator.push({ date: dateRep, cases: 0, deaths: 0 });
          index = accumulator.length - 1;
        }
        
        accumulator[index].cases = cases;
        accumulator[index].deaths = deaths;
  
        return accumulator;
      }, []);
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#FFFFFF', 
        },
      },
      title: {
        display: true,
        text: 'Schedule of diseases and deaths',
        color: '#FFFFFF', 
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#FFFFFF', 
        },
        grid: {
          color: '', 
        },
      },
      x: {
        reverse: true,
        ticks: {
          color: '#FFFFFF', 
        },
        grid: {
          color: '',
        },
      },
    },  animation: {
      duration: 1000, 
      easing: 'easeInOutQuart',
    },
  };

  const data = {
    labels: getPeriodData().map((item) => item.date),
    datasets: [
      
        {
          label: 'Cases',
          data: getPeriodData().map((item) => item.cases),
          borderColor: 'rgb(247, 255, 0)',
          backgroundColor: 'rgba(247, 255, 0)',
          pointRadius: 1,
        },
        {
          label: 'Deaths',
          data: getPeriodData().map((item) => item.deaths),
          borderColor: 'rgb(255, 0, 0)',
          backgroundColor: 'rgba(255, 0, 0)',
          pointRadius: 1,
      },
   
    ],
};

  return (
    <div className='chart-container'>
      <div className="dropdown">
        <div className="dropdown-button" >
          {selectedCountry || "Choose country"}
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
    </div>
  )
}

export default CovidGraphic

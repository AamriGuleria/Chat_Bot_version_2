import React, { useEffect } from 'react'
import WeatherPage from './WeatherPage';
import "./weather.css"
const GetLocation = ({data}) => {
  useEffect(()=>{
    console.log("the data",data)
  },[data])
  return (
    <div className="weather-container">
            <div className="weather-info">
                <h2>Weather in <span>{data.name}</span></h2>
                <div className="weather-details">
                    <img src={data.imageurl} alt={data.desc} className="weather-icon" />
                    <div className="weather-temp">{data.temp}°C</div>
                </div>
                <div className="weather-desc">{data.desc}</div>
                <div className="weather-extra">
                    <p>Feels like: {data.feels_like}°C</p>
                    <p>Humidity: {data.humidity}%</p>
                    <p>Pressure: {data.pressure} hPa</p>
                    <p>Min Temp: {data.temp_min}°C</p>
                    <p>Max Temp: {data.temp_max}°C</p>
                    <p>Visibility: {data.visibility} meters</p>
                    <p>Wind Speed: {data.wind_speed} m/s</p>
                </div>
            </div>
        </div>
  )
}

export default GetLocation

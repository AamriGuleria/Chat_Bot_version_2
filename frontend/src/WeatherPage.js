import { useEffect, useState } from "react";
import GetLocation from "./GetLocation";
import './weatherForm.css'
const WeatherPage = () => {
  const [city, setCity] = useState(""); // Stores the city name entered by the user
  const [data, setData] = useState(null); // Holds weather data fetched from the API
  const [formVisible, setFormVisible] = useState(false); // Boolean state to toggle form visibility
  const [location, setLocation] = useState(null); // Stores the user's geolocation coordinates
  const [found,setFound]=useState(true);
  // Fetch geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setFormVisible(true); // Show form if geolocation access is denied or fails
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setFormVisible(true); // Show form if geolocation is not supported
    }
  }, []);

  // Fetch weather data based on location
  useEffect(() => {
    if (location) {
  console.log("inside correct loop")
    fetch("http://localhost:10000/byLocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loc:location,
          lat:location.lat,
          lon:location.lon
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.msg==="city not found"){
            setFound(false);
          }
          else{
          setData(data);
          setFormVisible(false);}
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
}
  }, [location]);

  // Handle form submission
  const handleInfo = (e) => {
    e.preventDefault();
    console.log(city)
    setLocation(city)
  };

  return (
    <div className="w">
      {data ? (
        <GetLocation data={data} />
      ) : (
        formVisible && (
          <center>
          <form className="weather_form" onSubmit={handleInfo}>
            <input
              type="text"
              className="city"
              placeholder="CITY..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
          {!found?<p>City Not Found</p>:<p></p>}
          </center>
        )
      )}
    </div>
  );
};

export default WeatherPage;

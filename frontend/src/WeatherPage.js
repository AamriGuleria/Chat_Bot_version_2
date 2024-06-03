
import { useEffect, useState } from "react";
import GetLocation from "./GetLocation";
const WeatherPage = () => {
    const [city,setcity]=useState("")
    const [Data,setData]=useState([])
    const [form,setForm]=useState(false)
    const [location,setLocation]=useState()
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lon: longitude });
                // console.log(location)
            },
            (err) => {
                console.log(err);
            }
        );
    } else {
        console.log("error")
    }
      
  }, []);
  useEffect(()=>{
    if (location!==undefined && location.lat != null && location.lon != null) {
      // console.log(location)
        fetch("http://localhost:8000/weather", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                lat: `${location.lat}`,
                lon: `${location.lon}`
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            setData(data);
            <GetLocation data={Data}/>
            setForm(false)
            // console.log(data)
        })
        .catch((error) => {
            // console.log(error);
        });
    } else {
      // console.log("hello")
        setForm(true);
    }
  },[location])
  const handleInfo = async (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/weather", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: `${city}`
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        setData(data);
        <GetLocation data={Data}/>
        console.log(data);
    })
    .catch((error) => {
        console.log(error);
    });
    setcity("");
};
  return (
        <div className="w">
            {Data ? (
                <GetLocation data={Data} />
            ) : (
                form && (
                    <form onSubmit={handleInfo}>
                        <input
                            type="text"
                            className="city"
                            placeholder="CITY...."
                            value={city}
                            onChange={(e) => setcity(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </form>
                )
            )}
        </div>
  )
}

export default WeatherPage

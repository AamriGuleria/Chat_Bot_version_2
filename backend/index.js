import dotenv from 'dotenv';
dotenv.config({ path: 'C:/Users/asus/Desktop/chat-gpt/backend/.env' });//providing path for the env components
import {CohereClient} from 'cohere-ai'
import  fetch from 'node-fetch';
import express from "express";
import rateLimit from "express-rate-limit"
import bodyParser from "body-parser";
import cors from "cors";
import https from "https"
var api_key="";
let cohere=null;
var error="";
const MESSAGES={
    unauthorized: "Unauthorized Api Key",
    tooManyRequests: "Too many requests error",
    success: "success",
    fail: "fail",
    weatherError:"Failed to fetch weather data",
    weatherCity:"city not found",
    sufficientInfoError:"User credentials lack sufficient information",
    APIError:"API is malformed, missing required parameters, or uses unsupported options",
    EndPointNotFound:"requested resource or endpoint is not found",
}
const app=express(); 
const port = process.env.PORT || 10000;
//Using the middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));//allows maximum 100 requests per 15 min

// Route to handle weather information
app.post('/byLocation',async(req,res)=>{
    try{
    let url="";
    const apikey=process.env.OPENWEATHERMAP_API_KEY;
    console.log(req.body.loc)

    if (req.body.lat && req.body.lon && req.body.lat !== "null" && req.body.lon !== "null" && req.body.lat !== "" && req.body.lon !== "") {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.lon}&appid=2cd28bb8fb0edeb6c8211e3697b9f5d3&units=metric`;
    } else if (req.body.loc && req.body.loc !== "null" && req.body.loc !== "") {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.loc}&appid=2cd28bb8fb0edeb6c8211e3697b9f5d3&units=metric`;
    } else {
        // Handle case where neither lat/lon nor loc is provided
        return res.status(400).json({ error: "Location or latitude/longitude must be provided" });
    }
        https.get(url,function(response){
            if(response.statusCode!==200){
                return res.status(response.statusCode).json({ error: MESSAGES.weatherError });
            }
            response.on("data",function(data){
                const weatherdata=JSON.parse(data);
                if(weatherdata.message==='city not found'){
                    res.send({msg:MESSAGES.weatherCity})
                }
                else{
                const name=weatherdata.name
                const wind_speed=weatherdata.wind.speed;
                const visibility=weatherdata.visibility;
                const humidity=weatherdata.main.humidity;
                const pressure=weatherdata.main.pressure;
                const temp_max=weatherdata.main.temp_max;
                const temp_min=weatherdata.main.temp_min;
                const feels_like=weatherdata.main.feels_like;
                const temp=weatherdata.main.temp;
                const icon=weatherdata.weather[0].icon;
                const imgurl="http://openweathermap.org/img/wn/"+icon+"@2x.png"
                const weatherdesc=weatherdata.weather[0].description
                //Final Weather information in JSON Format
                res.send({temp:temp,icon:icon,imageurl:imgurl,desc:weatherdesc,name:name,visibility:visibility,wind_speed:wind_speed,humidity:humidity,pressure:pressure,temp_max:temp_max,temp_min:temp_min,feels_like:feels_like})
                }
            })
        })
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Interval Server Error"})
    }
})

app.get('/',(req,res)=>{
    res.send("Welcome To Smart Weather Chatbot")
})

//Route to authenticate user
app.post('/',async(req,res)=>{
    console.log("Welcome")
    try {
        const api_key = req.body.key; 
        if (!api_key) {
            return res.send({ response: MESSAGES.fail });
        }//checking the key beforehand if it is not null or undefined
        
        const url = 'https://api.cohere.com/v1/check-api-key';
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${api_key}`
            }
        };
        
        const fetchResponse = await fetch(url, options);
        const json = await fetchResponse.json();
        console.log(json)
        console.log(fetchResponse)
        if (json.valid) {
            if (!cohere) {
                cohere = new CohereClient({
                    token: api_key,
                });
            }
            res.send({ response: MESSAGES.success });
        } else {
            res.send({ response: MESSAGES.fail });
        }
    } catch (error) {
        console.error('error:', error);
        res.send({ response: MESSAGES.fail });
    }
})

//Handeling main req and res between server and user
app.post("/main",async(req,res)=>{ 
    const cont=req.body.content;
    const resp = await cohere.chat({
        message:cont,
        connectors: [{ id: 'web-search' }],
      });
      console.log(resp)
        if(resp.statusCode===401){
            res.send({content:MESSAGES.unauthorized})
        }
        else if(resp.statusCode===429){
            res.send({content:MESSAGES.tooManyRequests})
        }
        else if(resp.statusCode===403){
            res.send({content:MESSAGES.sufficientInfoError})
        }
        else if(resp.statusCode===400){
            res.send({content:MESSAGES.APIError})
        }
        else if(resp.statusCode===404){
            res.send({content:MESSAGES.EndPointNotFound})
        }
        else{
        res.send({content:resp.text})
      }  
})

app.listen(port, '0.0.0.0',()=>{
    console.log(`listening on port ${port}`)
})

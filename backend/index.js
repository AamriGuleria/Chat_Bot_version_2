// import { Configuration, OpenAIApi } from "openai";
import {CohereClient} from 'cohere-ai'
import  fetch from 'node-fetch';
import express from "express";
import rateLimit from "express-rate-limit"
import bodyParser from "body-parser";
import cors from "cors";
import https from "https"
import fs from "fs"
var api_key="";
let cohere=null;
var error="";
const app=express(); 
const port=8000;
app.use(bodyParser.json());
app.use(cors());
const limiter=rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max number of requests
    message: "Too many requests from this IP, please try again later" 
})
app.post('/weather',async(req,res)=>{
    let url="";
    const apikey="2cd28bb8fb0edeb6c8211e3697b9f5d3";
    if(req.body.lat!==undefined && req.body.lon!==undefined){
        url=`https://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.lon}&appid=${apikey}&units=metric`
        https.get(url,function(response){
            response.on("data",function(data){
                const weatherdata=JSON.parse(data);
                console.log(weatherdata)
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
                res.send({temp:temp,icon:icon,imageurl:imgurl,desc:weatherdesc,name:name,visibility:visibility,wind_speed:wind_speed,humidity:humidity,pressure:pressure,temp_max:temp_max,temp_min:temp_min,feels_like:feels_like})
            })
        })
    }
    else if(req.body.content!==undefined){
        const query=req.body.content;
        url="https://api.openweathermap.org/data/2.5/weather?q="+{query}+"&appid="+{apikey}+"&units=metric.";
        https.get(url,function(response){
            response.on("data",function(data){
                const weatherdata=JSON.parse(data);
                console.log(weatherdata)
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
                res.send({temp:temp,icon:icon,imageurl:imgurl,desc:weatherdesc,name:name,visibility:visibility,wind_speed:wind_speed,humidity:humidity,pressure:pressure,temp_max:temp_max,temp_min:temp_min,feels_like:feels_like})
            })
        })
    }
    else{
        res.send({error:"No weather parameters provided"})
    }
})
app.post('/',async(req,res)=>{
    try {
        const api_key = req.body.key; 
        if (!api_key) {
            return res.send({ response: "fail" });
        }
        
        const apiKey = req.body.key;
        const url = 'https://api.cohere.com/v1/check-api-key';
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };
        
        const fetchResponse = await fetch(url, options);
        const json = await fetchResponse.json();
        console.log(json)
        if (fetchResponse.ok && json.valid) {
            if (!cohere) {
                cohere = new CohereClient({
                    token: api_key,
                });
            }
            res.send({ response: "success" });
        } else {
            res.send({ response: "fail" });
        }
    } catch (error) {
        console.error('error:', error);
        res.send({ response: "fail" });
    }
})
app.use('/main',limiter)
app.post("/main",async(req,res)=>{ 
    const cont=req.body.content;
    const resp = await cohere.chat({
        message:cont,
        connectors: [{ id: 'web-search' }],
      });
      console.log(resp)
        if(resp.statusCode===401){
            res.send({content:"Unauthorized Api Key"})
        }
        else if(resp.statusCode===429){
            res.send({content:"Too many requests error"})
        }
        else if(resp.statusCode===403){
            res.send({content:"User credentials lack sufficient information"})
        }
        else if(resp.statusCode===400){
            res.send({content:"API is malformed, missing required parameters, or uses unsupported options"})
        }
        else if(resp.statusCode===404){
            res.send({content:"requested resource or endpoint is not found"})
        }
        else{
        res.send({content:resp.text})
      }  
})

app.listen(8000,()=>{
    console.log(`listening on port ${port}`)
})

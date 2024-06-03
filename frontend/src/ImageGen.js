
import React,{ useEffect, useState,useSearchParams } from 'react'
import {Link} from "react-router-dom"
import './index.css'
const ImageGen = () => {
    const[text,settext]=useState("")
    const urlSubmit=async(e,text)=>{
        e.preventDefault();
        console.log(text)
        if(text===""){
            console.log("empty")
          }
        else{
            fetch("http://localhost:8000/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "text":`${text}`,
        }),
      })
        }
        settext("")
    }
  return (
    <div className="App-2">
      <div className="Navbar">
          <div className='heading'>
            <p>Chat-bot</p>
          </div>
          <div className='contents'>
            <Link to="/" className="back"><p>Login</p></Link>
            <Link to="/about" className="about"><p>About</p></Link>
            <Link to="/main" className=""><p>Chat Section</p></Link>
          </div>
        </div>
        <div className="image-content">
        <form className="image-sub" onSubmit={e=>{urlSubmit(e,text)}}>
            <input type="text" className="image-url" placeholder="enter the url" value={text} onChange={e=>settext(e.target.value)}></input>
        </form>
        </div>
    </div>
  )
}

export default ImageGen

import { useEffect, useState } from "react";
import LoginPage from "./LoginPage.js"
import {BrowserRouter as Router,Route, Routes} from "react-router-dom"
import MainPage from "./MainPage.js"
import ImageGen from "./ImageGen.js"
import WeatherPage from "./WeatherPage.js"
import AboutPage from "./AboutPage.js"
import Speech from "./Speech.js"
import './index.css'
function App() {
  return (
    <>
    <div className="App">
      <Router>
        <Routes>
        {/* <Route path='/' element={<Speech/>}></Route> */}
        <Route path='/about' element={<AboutPage/>}></Route>
        {/* <Route path='/image' element={<ImageGen/>}></Route> */}
        <Route path='/' element={<LoginPage/>}></Route>
        <Route exact path='/main' element={< MainPage />}></Route>
        <Route exact path='/weather' element={< WeatherPage />}></Route>
        </Routes>
      </Router>
    </div>
</>
  );

      }

export default App;
// {toggleButton?(<img className="fa fa-edit add-btn hello" src={Add} onClick={addItem}></img>
//                 ):(<img className="fa fa-plus add-btn hello1" src={Add} onClick={addItem}></img>)}
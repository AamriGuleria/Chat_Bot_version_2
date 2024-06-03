import React from 'react';
import {Link} from "react-router-dom"
import './index.css';
const AboutPage = () => {
  return (
    <div className="aabout">
      <center>
        <div className="choose">
      <h4 className="about-head">About The Chat Bot 😎</h4>
      <div className="about-text">
        <p className="para">This chat bot requires login as the first step.</p>
        <p className="para">In the login page you are required to enter the Name and correct Api Key .</p>
        <p className="para">If you enter the correct Api Key then only you will receive the correct responses.</p>
        <p className="para">In the Chat Section,You can type your message whatever you want to ask to the bot .</p>
        <p className="para">You have a Navbar at the top through which you can navigate to the about page,login page or chat section.</p>
        <p className="para">Remember it is a chat bot. It can assist you only through chats.</p>
        <p className="para">Please wait till you receive any response because it may take some time.</p>
      </div>
      
      <div className="buttons-cage">
      <Link to="/" className="ab-log"><p>Login</p></Link>
      <Link to="/main" className="ab-main"><p>Chat Section</p></Link>
      </div>
      
      </div>
      </center>
    </div>
  )
}

export default AboutPage

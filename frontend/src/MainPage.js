import React,{ useEffect, useState,useSearchParams } from 'react'
import {Link} from "react-router-dom"
import './index.css'
import {useSpeechRecognition} from 'react-speech-kit';
const MainPage = () => {
    const [msg, setmsg] = useState("");//holds the chats temporarily
    const [chats, setchats] = useState([]);//store all the final chats
    const [type, settype] = useState(false);//type helps to disable and able the typing section according to situation
    const searchParams = new URLSearchParams(document.location.search).get('name')
    console.log(searchParams)//holds the name of the user
    const [value,setValue] =useState("")
    //speech recognition
    const {listen,listening,stop,transcript,resetTranscript}=useSpeechRecognition({
      onResult:(result)=>{
        if(result!==""){
        setValue(result);
        setmsg(result)
      }}
    })
    const chat = async (e,msg) => {
      e.preventDefault();
      if(msg!==""){
      settype(true)//request is in progress or the chat interface is in a loading state.
      let msgs=chats;//previous complete chats 
      msgs.push({role:searchParams,content:msg})// push the current user query only
      setchats(msgs);//update the chats section
     fetch("http://localhost:8000/main", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "content":`${msg}`,//send the user's query
        }),
      })
      .then((response) => response.json())//converting the response in the json format
        .then((data) => {
          console.log(data)
          if(data.content!==""){
            msgs.push({role:"Bot",content:data.content})//add the bot's response to the chats
            setchats(msgs);
            settype(false);//indicates the processing has been completed
          }
          else{
            msgs.push({role:"Bot",content:"sorry coudn't get it."})
            setchats(msgs);//add the bot's response to the chats
            settype(false);//indicates the processing has been completed
          }
          if(data.code==401){
            setInterval(()=>{
              window.location.href=`http://localhost:3000`;
            },1000)
          }
        })
        .catch((error) => {
          setchats([...chats,{role:"Bot",content:"Could not receive the correct data.Please try login again"}]);
          settype(true)
        });
        
      setmsg("");
      localStorage.setItem("items",JSON.stringify(chats));//storing all the chats in local storage
      console.log(localStorage.getItem("items"));
      }
      }
    return (
      <>
      <div className="App">
        <div className="Navbar">
          <div className='heading'>
            <p>Chat-bot</p>
          </div>
          <div className='contents'>
            <Link to="/" className="back"><p>Login</p></Link>
            <Link to="/about" className="about"><p>About</p></Link>
            <Link to="/weather" className="weather"><p><img src="/cloudy.png" height="30px" width="30px"></img></p></Link>
          </div>
        </div>
            <>
            <div className="form_and_type">
              <div className="your-chats">
          {
              chats.map((ele,ind)=>{
                  return(
                    <>
                    <center>
                    <div key={ind} className={ele.role === "Bot" ? "bot" : "user"}>
                    <p className="role"><img src={ele.role==="Bot"?"https://cdn.pixabay.com/photo/2020/01/13/08/17/robot-4761857_1280.png":"https://cdn.pixabay.com/photo/2022/03/27/23/57/woman-7096290_1280.png"} className="image-icon"/></p>
                    <p className="content">{ele.content}</p>
                  </div>
                  </center>
                  </>
                  )
              })
          }
          </div>
          </div>
              </>
              <div className={type?"hide":"form"}>
              <div id="listen">
              <form id='list'onSubmit={e => {chat(e, msg)}}>
                <input type="text" className="inp-msg" name="msg" value={msg} placeholder="type your message..." onChange={e => setmsg(e.target.value)} disabled={listening}/>
              </form>
              <form id='l'onSubmit={e => {chat(e, msg)}}>
              <button onClick={listening?stop:listen} >{listening?"stop":"Listen"}</button> 
              </form>
              </div>
            </div>
      </div>
  </>
    );
}
export default MainPage

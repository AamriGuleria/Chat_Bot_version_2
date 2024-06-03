import {useState} from "react"
import "./Sample.css"
import {useSpeechRecognition} from "react-speech-kit"
function Speech() {
  const [value,setValue] =useState("")
  const {listen,listening,stop,transcript,resetTranscript}=useSpeechRecognition({
    onResult:(result)=>{
      // console.log(result)
      setValue(result)
    }
  })
  return(
    <div>
      <button onClick={listening?stop:listen}>{listening?"stop":"Listen"}</button>
      <button onClick={resetTranscript}>Reset</button>
      <div>
        <p color="black">{value}</p>
      </div>
    </div>
  )
  }
  export default Speech;
  //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
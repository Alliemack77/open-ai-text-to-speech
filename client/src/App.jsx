import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {

  const [text, setText] = useState('')
  const [audioURL, setAudioURL] = useState(null)
  const [isLoading, setisLoading] = useState(false)

  function getText(formData) {
    const userText = formData.get('text')
    setText(userText)
    setisLoading(true)
  }

  useEffect(() =>  {

    const sendText = async () => {

      if(text.length < 1) {
        return
      } else {
        try {
          const response = await axios.post('http://localhost:5000/api', 
            {text: text}, 
            {responseType: 'blob'}
          )
          const url = URL.createObjectURL(response.data)
          setAudioURL(url)
          setisLoading(false)
    
        } catch (error) {
          console.error("Something bad happened!", error)
        }
      }
      

    }

    sendText()

    return () => {
      setAudioURL(null)
    }

  }, [text])


  return (
    <>
      <h1>What do you want to say?</h1>

      <form action={getText}>
          <div className="form-control">
            <label htmlFor="text" class="sr-only">Enter your text and hit generate to listen to Alloy speak.</label>
            <input
              id="text"
              name="text"
              type="text"
              placeholder='Enter some text!'
              aria-describedby="input-text-description"
            />
            <p class="sr-only" id="input-text-description">The audio will be available to play in the audio element below once the AI finishes generating your result.</p>
          </div>
        <button>Generate</button>
      </form>

      <div className='live-region-wrapper' aria-live='polite'>
        <audio src={audioURL} controls></audio>
        { isLoading && <p>Loading...</p>}
        { audioURL && <p>{text}</p>}
      </div>

    </>
  )
}

export default App
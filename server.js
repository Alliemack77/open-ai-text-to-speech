const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const corsOptions = {
    origin: ['http://localhost:5173']
}
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const port = 5000
const OpenAI = require('openai')

app.use(cors(corsOptions))
app.use(bodyParser.json())

console.log("KEY:", process.env.API_KEY)

const openai = new OpenAI({
    apiKey: process.env.API_KEY
})

const speechFile = path.resolve("./audio/speech.mp3")

async function main(res, text) {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
    });
    console.log("speech file:", speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    res.send(buffer)
}

app.post('/api', (req, res) => {
    main(res, req.body.text)
})

app.listen(process.env.PORT || port, () => console.log(`Your great server is listening on port ${port}`))
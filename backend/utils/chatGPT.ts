import OpenAI from 'openai'
import prompts from './prompts'
import dotenv from 'dotenv'

// dotenv.config()

export const requestGPTResponse = async (message: string) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const tones = [
        'Sound excited!',
        'Sound like a robot',
        'Sound bored',
        'Sound like a pirate',
        'Sound like Shakespeare',
        'Answer with exactly one word, all lowercase',
        'Sound like an inmate',
        'Sound like you are a duck pretending to be a human',
    ]

    const tone = tones[Math.floor(Math.random() * tones.length)]

    console.log("Tone: " + tone)
    
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content:
                    'You are attempting to blend in with humans responding to this prompt. \
                    Try to answer in a way that a human would. \
                    Use a short response. Do not provide an explanation. \
                    Give an answer that would not be expected of an AI.'+ tone
            },
            { role: 'user', content: message }
        ],
        model: 'gpt-4-turbo',
        temperature: 0.9
    })

    return completion.choices[0].message.content
}

// const prompt = prompts[Math.floor(Math.random() * prompts.length)]
// if (prompt) {
//     console.log(prompt)
//     requestGPTResponse(prompt).then((response) => {
//         console.log(response)
//     })
// }

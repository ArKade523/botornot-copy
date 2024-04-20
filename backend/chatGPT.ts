import OpenAI from 'openai'
import prompts from './prompts'

export const requestGPTResponse = async (message: string) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const tones = [
        'Sound like a 6-year old girl',
        'Sound excited!',
        'Sound like a robot',
        'Sound bored'
    ]

    const tone = tones[Math.floor(Math.random() * tones.length)]

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content:
                    'You are attempting to blend in with humans responding to this prompt. \
                    Try to answer in a way that a human would. \
                    Use a short response. Do not provide an explanation.' + tone
            },
            { role: 'user', content: message }
        ],
        model: 'gpt-4-turbo',
        temperature: 0.8
    })

    // console.log(completion.choices[0])
    console.log('Tone: ' + tone)

    return completion.choices[0].message.content
}

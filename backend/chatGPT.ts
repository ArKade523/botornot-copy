import OpenAI from 'openai'

export const requestGPTResponse = async (message: string) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
        messages: [{"role": "system", "content": "You are attempting to blend in with humans responding to this prompt. Try to answer in a way that a human would, trying to sound like a bot. Use a short response. Do not provide an explanation"},
            {"role": "user", "content": message}],
        model: "gpt-4-turbo",
        temperature: 0.9,
    });
    
    console.log(completion.choices[0]);

    return completion.choices[0].message.content;
}

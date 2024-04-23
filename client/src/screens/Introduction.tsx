import { useEffect, useState } from "react"

function Introduction() {
    const [timer, setTimer] = useState(10)
    const [prompt, setPrompt] = useState('Get in the bot mindset')

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((timer) => timer - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, []);

    useEffect(() => {
        timer === 8 && setPrompt("Answer the following and pretend to be a bot")
        timer === 6 && setPrompt("Receive 100 points for everyone you fool")
        timer === 4 && setPrompt("Earn 200 points for guessing the real bot")
        timer === 2 && setPrompt("The first prompt is...")
    }, [timer])

    return (
        <>
            <h1 className={`large-info ${(timer % 2) === 1 ? 'fade-out' : ''}`}>{prompt}</h1>
        </>
    )
}

export default Introduction

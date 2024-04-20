import { useState } from "react"

function Enter({ promp, api, setMode }) {
    const [response, setResponse] = useState('')

    return (
        <>
            <h2>{promp}</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    api.sendResponse(response)
                    setMode('wait')
                    }}>
                <input
                    type="text"
                    placeholder="Enter response here"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                >
                </input>
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}

export default Enter

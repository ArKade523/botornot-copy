import { useState } from "react"

function Enter({ promp, api, setMode }) {
    const [response, setResponse] = useState('')

    return (
        <>
            <p className="medium-info">{promp}</p>
            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault()
                    api.sendResponse(response)
                    setMode('wait');
                    }}>
                <textarea
                    placeholder="Enter response here"
                    className="input textarea"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                >
                </textarea>
                <button type='submit' className="button">Submit</button>
            </form>
        </>
    )
}

export default Enter

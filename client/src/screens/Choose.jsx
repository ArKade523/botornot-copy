function Choose({ prompt, responses, api, setMode }) {
    return (
        <>
            <h1>{prompt}</h1>
            <p>Who is the bot?</p>
            {responses.map((response) => {
                <button
                    className="response"
                    onClick={(e) => {
                        api.vote(e.target.value)
                        setMode('wait')
                    }}
                >
                    {response}
                </button>
            })}
        </>
    )
}
export default Choose

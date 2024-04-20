function Choose({ prompt, responses, api, setMode }) {
    return (
        <>
            <p className="medium-info">{prompt}</p>
            <p className="small-info">Who is the bot?</p>
            {responses.map((response) => {
                <button
                    className="button"
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

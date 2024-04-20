function Choose({ prompt, responses, api, setMode }) {
    return (
        <>
            <p className="medium-info">{prompt}</p>
            <p className="small-info">Who is the bot?</p>
            {responses.map((response) => {
                console.log(response)
                return(
                <button
                    className="button"
                    key={response}
                    onClick={(e) => {
                        api.vote(response)
                        setMode('wait')
                    }}
                >
                    {response}
                </button>)
            })}
        </>
    )
}
export default Choose

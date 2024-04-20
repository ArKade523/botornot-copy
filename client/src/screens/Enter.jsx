function Enter({ promp, api, setMode }) {
    const [response, setResponse] = useState('');

    return (
        <>
            <h2>{promp}</h2>
            <input type='text' placeholder="Enter response here" onChange={e => setResponse(e.target.value)} onSubmit={() => {api.setResponse(response); setMode('wait')}}>{response}</input>
        </>
    )
}

export default Enter
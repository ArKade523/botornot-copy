import { useState } from 'react'
import Input from '../components/Input'
import Responses from '../components/Responses';
import useApi from '../utils/api';

function Display() {
  const api = useApi('localhost:3000');
  const [code, setCode] = useState(undefined);
  const [prompt, setPrompt] = useState('Welcome to Bot-or-Not');
  const [responses, setResponses] = useState(["Hello", "World"]);
  const [bot, setBot] = useState(undefined);
  const [best, setBest] = useState(undefined);

  useEffect(() => {
    socket = api.socket();

    socket.on('display_code', (res) => {
      console.log(res.code);
      setCode(res.code);
    })
    
    
  }, []);

  return (
    <>
      {(prompt !== undefined) && <h3 className='prompt'>prompt</h3>}
      {(code !== undefined) && <h3 className='code'>code</h3>}
      <Input operation={'display'}></Input>
      <Responses responses={responses}></Responses>
      {(bot !== undefined) && <h2 className='bot-response'>{bot}</h2>}
      {(best !== undefined) && <h2 className='best-response'>{best}</h2>}
    </>
  )
}

export default Display
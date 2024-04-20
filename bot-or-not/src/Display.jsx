import { useState } from 'react'
import Input from './Input'
import useApi from './utils/api';

function Display() {
  const api = useApi('localhost:3000');
  const [code, setCode] = useState(undefined);
  const [prompt, setPrompt] = useState('Welcome to Bot-or-Not');

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
      <Input operation={'display'}></Input>
    </>
  )
}

export default Display
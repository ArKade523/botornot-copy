import { useEffect, useState } from 'react'
import Input from './Input'
import { useApi } from './hooks/useApi';
import { io } from 'socket.io-client';

function Display() {
  const api = useApi();
  const [code, setCode] = useState(undefined);
  const [socket, setSocket] = useState(null);
  const [prompt, setPrompt] = useState('Welcome to Bot-or-Not');

  useEffect(() => {
    const s = api.getSocket();
    setSocket(s);

    return () => {
      s.disconnect();
    }
    
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('create_room')

    socket.on('display_code', (res) => {
      console.log(res);
      setCode(res.code);
    })

    return () => {
      socket.off('display_code');
    }

  }, [socket]);

  return (
    <>
      {(prompt !== undefined) && <h3 className='prompt'>{prompt}</h3>}
      <Input operation={'display'}></Input>
    </>
  )
}

export default Display
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Loading from '../components/Loading'
import { setToken } from '../../slices/authSlice'
import { useApi } from '../../hooks/useApi'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const api = useApi()

    const sendLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { token } = await api?.post('/sessions', { email, password })

        dispatch(setToken(token))
        setLoading(false)
        navigate('/dashboard')
    }
    return (
        <div>
            <h1>Login</h1>
            {loading && <Loading />}
            <form onSubmit={sendLogin}>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login
import { useState } from 'react'
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useDispatch } from 'react-redux'
import { setToken } from '../slices/authSlice'

function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const api = useApi()

    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { token } = await api.post('/users', {
            firstName: firstName,
            lastName: lastName,
            email,
            password
        })

        dispatch(setToken(token))
        setLoading(false)
        navigate('/dashboard')
    }

    return (
        <div>
            <h1>Register</h1>
            {loading && <Loading />}
            <form onSubmit={registerUser}>
                <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
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
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register

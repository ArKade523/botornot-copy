import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: window.localStorage.getItem('user') as User | null,
        token: window.localStorage.getItem('jwt') as string | null
    },
    reducers: {
        setUser: (state, { payload }) => {
            if (payload) {
                window.localStorage.setItem('user', JSON.stringify(payload.user))
            } else {
                window.localStorage.removeItem('user')
            }
            state.user = payload.user
        },
        setToken: (state, { payload }) => {
            if (payload) {
                window.localStorage.setItem('jwt', payload)
            } else {
                window.localStorage.removeItem('jwt')
            }
            state.token = payload
        }
    }
})

export const { setUser, setToken } = authSlice.actions
export const authReducer = authSlice.reducer

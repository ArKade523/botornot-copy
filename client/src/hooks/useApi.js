import { useContext } from 'react'
import { ApiContext } from '../utils/api'

export const useApi = () => {
    return useContext(ApiContext)
}

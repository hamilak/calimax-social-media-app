import { createContext, useContext, useState, useEffect, FC } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import {
    AuthContextProps,
    AuthProviderProps,
    JwtPayloadType,
} from '../Types/AuthProps'
import axiosInstance from '../interceptor/axiosInstance'

const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: async () => {},
    logout: () => {},
    isAuthenticated: false,
    error: null,
    loading: false,
})

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<JwtPayloadType | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = Cookies.get('accessToken')
        if (token) {
            try {
                const decodedUser: JwtPayloadType = jwtDecode(token)
                setUser(decodedUser)
                setIsAuthenticated(true)
            } catch (error) {
                Cookies.remove('accessToken')
                Cookies.remove('refreshToken')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)
            const response = await axios.post('/api/auth/login', {
                email,
                password,
            })
            console.log(response)
            if (response.status === 201) {
                const { accessToken, refreshToken } = response.data

                Cookies.set('accessToken', accessToken, { path: '/' })
                Cookies.set('refreshToken', refreshToken, { path: '/' })

                const decodedUser: JwtPayloadType = jwtDecode(accessToken)
                setUser(decodedUser)
                setIsAuthenticated(true)

                if (decodedUser.role) {
                    navigate(`/home`)
                } else {
                    navigate('/')
                }
            }
        } catch (error: any) {
            setLoading(false)
            if (error.response && error.response.status === 401) {
                setError('Invalid login credentials')
            } else if (error.response && error.response.status === 404) {
                setError('Invalid login credentials')
            } else {
                setError('An error occured')
            }
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            const response = await axiosInstance.post('/api/auth/logout')
            if (response.status === 201) {
                Cookies.remove('accessToken')
                Cookies.remove('refreshToken')
                setUser(null)
                setIsAuthenticated(false)
                navigate('/')
            }
        } catch (error) {
            navigate('/')
            setError('An error occured')
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, login, logout, isAuthenticated, error, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

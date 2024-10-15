import { ReactNode } from 'react'

export interface AuthProviderProps {
    children: ReactNode
}

export interface AuthContextProps {
    user: any
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    error: string | null
    loading: boolean
}

export interface JwtPayloadType {
    sub: string
    email: string
    role: string
    exp: number
    iat: number
}

export interface ProtectedRouteProps {
    children: ReactNode
}

export type FormErrors = {
    firstName?: string
    lastName?: string
    email?: string
    gender?: string
    schoolLevel?: string
    address?: string
    password?: string
    confirmPassword?: string
    schoolName?: string
    phoneNumber?: string
    dateOfBirth?: string
}

export type ValidationErrors = {
    firstName?: string
    lastName?: string
    email?: string
    gender?: string
    schoolLevel?: string
    address?: string
    password?: string
    confirmPassword?: string
    schoolName?: string
    phoneNumber?: string
    dateOfBirth?: string
}

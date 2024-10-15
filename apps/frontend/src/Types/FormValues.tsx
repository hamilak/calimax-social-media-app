export interface LoginFormValues {
    email: string
    password: string
}

export interface SignupFormValues {
    username?: string
    email?: string
    password?: string
    bio?: string
    profilePicture?: File | null
    confirmPassword?: string
}

export interface PostFormValues {
    content: string,
    image?: File | null
}

export interface MessageFormValues {
    text: string
}
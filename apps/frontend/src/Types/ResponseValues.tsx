export interface PostResponseValues {
    _id: string,
    userId: {
        _id: string
        username: string
        profilePicture: string,
    },
    content: string,
    image: string,
    likes: any[],
    comments: any[],
    createdAt: Date,
    updatedAt: Date
}

export interface UserResponseValues {
    _id: string,
    username: string,
    email: string
    bio: string
    profilePicture: string
    accountStatus: string
    role: string
    followers: UserResponseValues[]
    following: UserResponseValues[]
    createdAt: Date,
    updatedAt: Date
}

export interface MessageResponseValues {
    _id: string
    senderId: any
    receiverId: any
    text: string
    read: boolean
    createdAt: Date,
    updatedAt: Date
}
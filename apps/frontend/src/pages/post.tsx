import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import Image from '../assets/network-user-icon.png'
import { Drawer, Input, List } from 'rsuite'
import { PostFormValues } from '../Types/FormValues'
import axiosInstance from '../interceptor/axiosInstance'
import { PostResponseValues, UserResponseValues } from '../Types/ResponseValues'
import { truncateDescription } from '../utils/functions'
import { useAuth } from '../context/AuthContext'
import Posts from '../components/Posts'

const Post: FC = () => {
    const [formValues, setFormValues] = useState<PostFormValues>({
        content: '',
        image: null
    })
    const [open, setOpen] = useState<boolean>(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [posts, setPosts] = useState<PostResponseValues[]>([])
    const [userValues, setUserValues] = useState<UserResponseValues>()
    const [selectedList, setSelectedList] = useState<string>('none')
    const { user } = useAuth()

    const handleSelectList = (selectedList: string) => {
        setSelectedList(selectedList)
    }

    const handleCloseDrawer = () => {
        setOpen(false)
    }

    const handleChange = (name: string, value: any) => {
        setFormValues((prevValue) => ({ ...prevValue, [name]: value }))
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileSizeInMB = file.size / 1024 / 1024;
            const fileType = file.type;

            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(fileType)) {
                alert('Only JPG, JPEG, or PNG files are allowed.');
                return;
            }
            if (fileSizeInMB > 10) {
                alert('File size exceeds 10MB.');
                return;
            }

            setFormValues((prevValue) => ({ ...prevValue, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageChange = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('content', formValues.content);
        if (formValues.image) {
            formData.append('image', formValues.image);
        }

        const response = await axiosInstance.post('/api/post', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response)
    }

    const handleGetUserPosts = async () => {
        try {
            const response = await axiosInstance.get(`/api/posts/${user?._id}`)
            console.log(response)
            if (response.status === 200) {
                setPosts(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetUser = async () => {
        try {
            const response = await axiosInstance.get(`/api/user/${user?._id}`)
            console.log(response)
            if (response.status === 200) {
                setUserValues(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        handleGetUserPosts()
        handleGetUser()
    }, [])

    const handleUnfollowUser = async (id: string) => {
        try {
            const response = await axiosInstance.post(`/api/user/unfollow/${id}`)
            console.log(response)
        } catch (error) {

        }
    }

    const handleFollowUser = async (followerId: string) => {
        try {
            console.log('follow')
            const response = await axiosInstance.post(`/api/user/follow/${followerId}`)
            console.log(response)
        } catch (error) {

        }
    }

    return (
        <Layout>
            <div className='flex min-h-full'>
                <div className='w-2/3 '>
                    <div>
                        <h6>{userValues?.username}</h6>
                    </div>
                    <div className='flex gap-4 items-center h-40 justify-center mb-4'>
                        <div className='flex flex-col justify-center items-center border border-gray-200 rounded-full w-40 h-40'>
                            <img src={Image} alt="Pfp" className='w-28 h-28' />
                            <button className='text-xs font-bold'>Change Picture</button>
                        </div>
                        <div className='w-2/5 items-center p-5 space-y-4'>
                            <div className='flex justify-between text-center '>
                                <div className=''>
                                    <p className='text-xs font-semibold'>Posts</p>
                                    <p className='font-semibold text-2xl'>{posts.length}</p>
                                </div>
                                <div className='cursor-pointer' onClick={() => setSelectedList('followers')}>
                                    <p className='text-xs font-semibold'>Followers</p>
                                    <p className='font-semibold text-2xl'>{userValues?.followers.length}</p>
                                </div>
                                <div className='cursor-pointer' onClick={() => setSelectedList('following')}>
                                    <p className='text-xs font-semibold'>Following</p>
                                    <p className='font-semibold text-2xl'>{userValues?.following.length}</p>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <button className='hover:bg-purple-800 bg-purple-600 font-bold px-6 py-2 rounded-md text-white'>Edit profile</button>
                                <button onClick={() => setOpen(true)} className='hover:bg-gray-300 bg-gray-200 font-bold px-6 py-2 rounded-md'>New post</button>
                            </div>
                        </div>
                    </div>
                    <div className='border-t overflow-auto'>
                        <p className='text-center font-bold text-base pt-4'>My Posts</p>
                        <Posts showButton={true} setOpen={setOpen} noPostsMessage='No posts' posts={posts} />
                    </div>
                </div>
                <div className='w-1/3 border-l'>
                    {selectedList === 'none' ? (
                        <div className='flex justify-center items-center min-h-full'>
                            <p>Click <button onClick={() => handleSelectList('followers')} className='text-blue-500'>Followers</button> or <button onClick={() => handleSelectList('following')} className='text-blue-500'>Following</button> to see the list</p>
                        </div>
                    ) : selectedList === 'followers' ? (
                        <div>
                            <h3 className='font-bold text-lg text-center'>Followers</h3>
                            {userValues?.followers && userValues.followers.length > 0 ? (
                                <List>
                                    {userValues.followers.map((follower) => {
                                        const isFollowing = userValues?.following.some(
                                            (followee) => followee._id === follower._id
                                        );

                                        return (
                                            <List.Item key={follower._id}>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex gap-8">
                                                        <img src={follower.profilePicture || Image} alt="pfp" className="w-10 h-10 rounded-full" />
                                                        <div>
                                                            <p>{follower.username}</p>
                                                            <p>{truncateDescription(follower.bio, 8)}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {isFollowing ? (
                                                            <button className="hover:bg-gray-300 bg-gray-200 font-bold px-4 py-2 rounded-md">
                                                                Message
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="hover:bg-purple-800 bg-purple-600 font-bold px-4 py-2 rounded-md text-white"
                                                                onClick={() => handleFollowUser(follower._id)}
                                                            >
                                                                Follow Back
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </List.Item>
                                        );
                                    })}
                                </List>
                            ) : (
                                <div className="flex justify-center items-center min-h-full">
                                    <p>You have 0 followers</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3 className='font-bold text-lg text-center'>Following</h3>
                            {userValues?.following && userValues.following.length > 0 ? (
                                <List>
                                    {userValues?.following.map((followee) => (
                                        <List.Item key={followee._id}>
                                            <div className='flex justify-between'>
                                                <div className='flex gap-8'>
                                                    <div>
                                                        <img src={followee.profilePicture || Image} alt="pfp" className='w-10 h-10 rounded-full' />
                                                    </div>
                                                    <div>
                                                        <p>{followee.username}</p>
                                                        <p>{truncateDescription(followee.bio, 8)}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="font-bold rounded-md text-blue-600"
                                                    onClick={() => handleUnfollowUser(followee._id)}
                                                >
                                                    Unfollow
                                                </button>
                                            </div>
                                        </List.Item>
                                    ))}
                                </List>
                            ) : (
                                <div className='flex justify-center items-center min-h-full'>
                                    <p>You are not following any body</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Drawer open={open} onClose={handleCloseDrawer}>
                <Drawer.Header>
                    <Drawer.Title>New post</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className='font-semibold text-base' htmlFor="content">Content</label>
                                <Input value={formValues.content} onChange={(value) => handleChange('content', value)} name='content' />
                            </div>
                            <div className='mt-4'>
                                <label className='font-semibold text-base' htmlFor="image">Image</label>
                                <div
                                    className='border-dashed border-2 border-gray-400 p-4 text-center cursor-pointer flex justify-center'
                                    onClick={handleImageChange}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Selected" className='w-64 h-64 object-contain' />
                                    ) : (
                                        <span className='text-gray-500'>Click to upload an image</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/png, image/jpeg"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <button type='submit' className='mt-4 hover:bg-purple-800 bg-purple-600 font-bold px-6 py-2 rounded-md text-white'>Submit</button>
                        </form>
                    </div>
                </Drawer.Body>
            </Drawer>
        </Layout>
    )
}

export default Post

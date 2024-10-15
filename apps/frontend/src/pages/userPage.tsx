import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Image from '../assets/network-user-icon.png'
import { List } from 'rsuite'
import axiosInstance from '../interceptor/axiosInstance'
import { PostResponseValues, UserResponseValues } from '../Types/ResponseValues'
import { truncateDescription } from '../utils/functions'
import { useAuth } from '../context/AuthContext'
import { IoIosArrowBack } from "react-icons/io";
import Posts from '../components/Posts'

const UserPage: FC = () => {
  const { user } = useAuth()
  const { userId } = useParams()
  console.log(userId)
  const navigate = useNavigate()

  const [posts, setPosts] = useState<PostResponseValues[]>([])
  const [userValues, setUserValues] = useState<UserResponseValues>()
  const [currentUserValues, setCurrentUserValues] = useState<UserResponseValues>()
  const [selectedList, setSelectedList] = useState<string>('none')

  const handleSelectList = (selectedList: string) => {
    setSelectedList(selectedList)
  }

  const handleGetUserPosts = async () => {
    try {
      const response = await axiosInstance.get(`/api/posts/${userId}`)
      console.log(response)
      if (response.status === 200) {
        setPosts(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (userId === user?._id) {
    navigate('/posts')
  }

  const handleGetUser = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/${userId}`)
      console.log(response)
      if (response.status === 200) {
        setUserValues(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetCurrentUser = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/${user?._id}`)
      console.log(response)
      if (response.status === 200) {
        setCurrentUserValues(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleGetUserPosts()
    handleGetUser()
    handleGetCurrentUser()
  }, [])

  const handleFollowUser = async (followerId: string) => {
    try {
      console.log('follow')
      const response = await axiosInstance.post(`/api/user/follow/${followerId}`)
      console.log(response)
    } catch (error) {

    }
  }

  const handleUnfollowUser = async (followerId: string) => {
    try {
      const response = await axiosInstance.post(`/api/user/unfollow/${followerId}`)
      console.log(response)
    } catch (error) {

    }
  }

  const handleNavBack = () => {
    navigate(-1)
  }

  return (
    <Layout>
      <div className='flex min-h-full'>
        <div className='w-2/3 '>
          <button className='flex items-center font-semibold text-xs text-blue-600' onClick={handleNavBack}><IoIosArrowBack /> Back</button>
          <h6>{userValues?.username}</h6>
          <div className='flex gap-4 items-center h-40 justify-center'>
            <div className='flex flex-col justify-center items-center border border-gray-200 rounded-full w-40 h-40'>
              <img src={Image} alt="Pfp" className='w-28 h-28' />
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
                {currentUserValues && userValues ? (
                  currentUserValues.following.length === 0 ? (
                    <button
                      className='hover:bg-purple-800 bg-purple-600 font-bold px-6 py-2 rounded-md text-white'
                      onClick={() => handleFollowUser(userValues._id)}
                    >
                      Follow
                    </button>
                  ) : (
                    currentUserValues.following.map((followee) => {
                      // const isFollowing = currentUserValues.following.some(
                      //   (following) => following._id === userValues._id
                      // );

                      const isFollowBack = userValues.followers.some(
                        (follower) => follower._id === currentUserValues._id
                      );

                      return (
                        <div key={followee._id}>
                          {followee._id === userValues._id ? (
                            <button
                              className='hover:bg-purple-800 bg-purple-600 font-bold px-6 py-2 rounded-md text-white'
                              onClick={() => handleUnfollowUser(followee._id)}
                            >
                              Unfollow
                            </button>
                          ) : (
                            <button
                              className='hover:bg-purple-800 bg-purple-600 font-bold px-6 py-2 rounded-md text-white'
                              onClick={() => {
                                isFollowBack ? handleUnfollowUser(followee._id) : handleFollowUser(followee._id);
                              }}
                            >
                              {isFollowBack ? 'Follow Back' : 'Follow'}
                            </button>
                          )}
                        </div>
                      );
                    })
                  )
                ) : null}
                <button className='hover:bg-gray-300 bg-gray-200 font-bold px-6 py-2 rounded-md'>Message</button>
              </div>
            </div>
          </div>
          <div className='border-t overflow-auto gap-4 mt-4 pt-4'>
            <Posts posts={posts} showButton={false} noPostsMessage='No posts' />
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
                    const isCurrentUserFollowing = currentUserValues?.following.some(
                      (followee) => followee._id === follower._id
                    );

                    const isFollowBack = currentUserValues?._id !== follower._id &&
                      !isCurrentUserFollowing &&
                      currentUserValues?.followers.some((followerItem) => followerItem._id === follower._id);

                    return (
                      <List.Item key={follower._id}>
                        <div>
                          <div className="flex justify-between items-center">
                            <div className='flex gap-8'>
                              <div className='flex justify-center items-center border border-gray-100 rounded-full'>
                                <img
                                  src={follower.profilePicture || Image}
                                  alt="pfp"
                                  className="w-10 h-10 rounded-full"
                                />
                              </div>
                              <div>
                                <p>{follower.username}</p>
                                <p>{truncateDescription(follower.bio, 8)}</p>
                              </div>
                            </div>
                            <div>
                              {follower._id === currentUserValues?._id ? (
                                <button
                                  className="text-blue-600 font-bold rounded-md"
                                  onClick={() => navigate('/posts')}
                                >
                                  View
                                </button>
                              ) : isCurrentUserFollowing ? (
                                <button
                                  className="font-bold rounded-md text-blue-600"
                                  onClick={() => handleUnfollowUser(follower._id)}
                                >
                                  Unfollow
                                </button>
                              ) : isFollowBack ? (
                                <button
                                  className="font-bold rounded-md text-blue-600"
                                  onClick={() => handleFollowUser(follower._id)}
                                >
                                  Follow Back
                                </button>
                              ) : (
                                <button
                                  className="hovefont-bold rounded-md text-white"
                                  onClick={() => handleFollowUser(follower._id)}
                                >
                                  Follow
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    );
                  })}
                </List>

              ) : (
                <div className='flex justify-center items-center min-h-full'>
                  <p>{userValues?.username} has 0 followers</p>
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
                      <div>
                        <div className='flex gap-8'>
                          <img src={followee.profilePicture} alt="pfp" className='w-10 h-10 rounded-full' />
                          <p>{followee.username}</p>
                        </div>
                        <p>{truncateDescription(followee.bio, 8)}</p>
                      </div>
                    </List.Item>
                  ))}
                </List>
              ) : (
                <div className='flex justify-center items-center min-h-full'>
                  <p>{userValues?.username} is not following any body</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default UserPage


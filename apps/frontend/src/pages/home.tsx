import { FC, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Tabs, List, Input, InputGroup } from 'rsuite'
import { RiSearch2Line } from 'react-icons/ri'
import { PostResponseValues, UserResponseValues } from '../Types/ResponseValues'
import axiosInstance from '../interceptor/axiosInstance'
import { useNavigate } from 'react-router-dom'
import Posts from '../components/Posts'

const Home: FC = () => {
  const [q, setQ] = useState<string>('')
  const [users, setUsers] = useState<UserResponseValues[]>([])
  const [posts, setPosts] = useState<PostResponseValues[]>([])
  const [followingPosts, setFollowingPosts] = useState<PostResponseValues[]>([])
  const [followersPosts, setFollowersPosts] = useState<PostResponseValues[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserResponseValues[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const navigate = useNavigate()
  const handleInputChange = (value: string) => {
    setQ(value)
    setShowResults(value.length > 0);
  }

  const handleSearch = (q: string) => {
    console.log(q)
  }

  const getAllPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/posts/all')
      console.log(response)
      if (response.status === 200) {
        setPosts(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getFollowingPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/posts/following')
      console.log(response)
      if (response.status === 200) {
        setFollowingPosts(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getFollowersPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/posts/followers')
      console.log(response)
      if (response.status === 200) {
        setFollowersPosts(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/users');
      console.log(response);
      if (response.status === 200) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPosts()
    getAllUsers();
    getFollowersPosts();
    getFollowingPosts();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [q, users]);

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
    setShowResults(false);
  };

  return (
    <Layout>
      <div className='flex gap-4 h-full'>
        <div className='w-2/3 max-h-full overflow-auto'>
          <div className='flex justify-between'>
            <h5>Feed</h5>
            <div className='w-1/2'>
              <InputGroup>
                <Input
                  onChange={(value) => handleInputChange(value)}
                  value={q}
                  className='w-full'
                  placeholder='Search users...'
                  type='search'
                />
                <InputGroup.Addon>
                  <button onClick={() => handleSearch(q)}>
                    <RiSearch2Line />
                  </button>
                </InputGroup.Addon>
              </InputGroup>
              {showResults && (
                <div className='absolute z-10 bg-white border border-gray-300 rounded-md max-h-60 overflow-auto w-1/3 mt-1'>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        className='p-2 cursor-pointer hover:bg-gray-100 flex gap-4'
                        onClick={() => handleUserClick(user._id)}
                      >
                        {user.profilePicture && (
                          <img src={user.profilePicture} alt="pfp" />
                        )}
                        <p>{user.username}</p>
                      </div>
                    ))
                  ) : (
                    <div className='p-2'>No users found</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='max-h-full overflow-auto'>
            <Tabs defaultActiveKey="1" appearance="subtle">
              <Tabs.Tab eventKey="1" title="All">
                <Posts showButton={false} noPostsMessage='Your feed is empty' posts={posts} />
              </Tabs.Tab>
              <Tabs.Tab eventKey="2" title="Followers">
                <Posts showButton={false} noPostsMessage='Your feed is empty' posts={followersPosts} />
              </Tabs.Tab>
              <Tabs.Tab eventKey="3" title="Following">
                <Posts showButton={false} noPostsMessage='Your feed is empty' posts={followingPosts} />
              </Tabs.Tab>
            </Tabs>
          </div>
        </div>
        <div className='max-h-full overflow-auto border-l w-1/3 px-4'>
          <div className='mb-2'>
            <h6>Messages</h6>
          </div>
          <div className='mt-2'>
            <List>
              <List.Item>Message 1</List.Item>
              <List.Item>Message 2</List.Item>
              <List.Item>Message 3</List.Item>
              <List.Item>Message 4</List.Item>
            </List>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
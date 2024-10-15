import { FC, useEffect, useState } from "react"
import Layout from "../components/Layout"
import { Input, InputGroup, List } from "rsuite"
import { RiSearch2Line } from "react-icons/ri"
import { PostResponseValues, UserResponseValues } from "../Types/ResponseValues"
import axiosInstance from "../interceptor/axiosInstance"
import Posts from "../components/Posts"
import { useNavigate } from "react-router-dom"

const Explore: FC = () => {
  const navigate = useNavigate()
  const [q, setQ] = useState<string>('')
  const [posts, setPosts] = useState<PostResponseValues[]>([])
  const [showResults, setShowResults] = useState<boolean>(false);
  const [users, setUsers] = useState<UserResponseValues[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserResponseValues[]>([]);

  const handleInputChange = (value: string) => {
    setQ(value)
    setShowResults(value.length > 0);
  }

  const handleSearch = (q: string) => {
    console.log(q)
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
    getAllUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [q, users]);

  const getPosts = async () => {
    try {
      console.log('hello')
      const response = await axiosInstance.get('/api/posts')
      console.log(response)
      if (response.status === 200) {
        setPosts(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  console.log(posts)

  useEffect(() => {
    getPosts();
  }, []);

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
    setShowResults(false);
  };

  return (
    <Layout>
      <div className="flex gap-4 min-h-full">
        <div className="w-2/3 max-h-full overflow-auto">
          <h6>Explore</h6>
          <div>
            <Posts posts={posts} noPostsMessage="Explore is empty, refresh" showButton={false} />
          </div>
        </div>
        <div className='w-1/3 border-l overflow-auto px-4'>
          <div className="fixed top-14 flex justify-center">
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
          </div>
          {showResults && (
            <div className='overflow-auto mt-14'>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <List>
                    <List.Item
                      key={user._id}
                      className='p-2 cursor-pointer hover:bg-gray-100 mt'
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.profilePicture && (
                        <img src={user.profilePicture} alt="pfp" />
                      )}
                      <p>{user.username}</p>
                    </List.Item>
                  </List>
                ))
              ) : (
                <div className='p-2'>No users found</div>
              )}
            </div>
          )}
          <div></div>
        </div>
      </div>
    </Layout>
  )
}

export default Explore
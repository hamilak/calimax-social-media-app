import { FC } from "react";
import { PostResponseValues } from "../Types/ResponseValues";
import { FcLikePlaceholder } from "react-icons/fc";
import { RiMessage2Line } from "react-icons/ri";
import Image from '../assets/network-user-icon.png';
import { convertDate } from "../utils/functions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PostProps {
  posts: PostResponseValues[];
  noPostsMessage: string;
  showButton: boolean;
  setOpen?: (input: boolean) => void;
}

const Posts: FC<PostProps> = ({ posts, noPostsMessage, showButton, setOpen }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const handleUserClick = (userId: string) => {
    if(userId === user._id) {
      navigate('/profile')
    } else {
      navigate(`/user/${userId}`);
    }
  };
  return (
    <div>
      {posts && posts.length > 0 ? (
        <div className="">
          {posts.map((post) => (
            <div key={post._id} className="w-full p-4">
              <div className="border border-gray-200 p-2 rounded-md">
                <div>
                  <div className="flex justify-between border-b border-b-gray-100 py-2 cursor-pointer" onClick={()=>handleUserClick(post.userId._id)}>
                    <div className="flex gap-4">
                      <div className="border rounded-full w-6 h-6 flex justify-center items-center">
                        <img className="w-5 h-5" src={post.userId.profilePicture || Image} alt="" />
                      </div>
                      <p className="font-bold">{post.userId.username}</p>
                    </div>
                    <p className="text-xs">{convertDate(post.createdAt)}</p>
                  </div>
                  <p>{post.content}</p>
                  {post.image && (
                    <div className="flex justify-center items-center">
                      <img className="w-32 h-32 object-contain" src={post.image} alt="Post" />
                    </div>
                  )}
                  <div className="flex gap-8">
                    <div className="flex gap-1">
                      <button><FcLikePlaceholder /> </button>
                      <button>{post.likes.length} likes</button>
                    </div>
                    <div className="flex gap-1">
                      <button><RiMessage2Line /> </button>
                      <button>{post.comments.length} Comments</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center text-center min-h-64">
          <div>
            <p>{noPostsMessage}</p>
            {showButton && setOpen && (
              <button onClick={() => setOpen(true)} className="mt-2 text-white hover:bg-purple-800 bg-purple-600 font-bold px-6 py-2 rounded-md">
                New post
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;

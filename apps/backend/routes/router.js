const express = require('express');
const route = express.Router();
const upload = require('../config/multerConfig');
const { unless, authenticateJWT } = require('../middleware/authenticateJwt');
 
// apply authenticatejwt globally except some routes
route.use(unless(['/auth/login', '/user'], authenticateJWT))

// controllers
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController');
const messageController = require('../controllers/messageController');

// auth routes
route.post('/auth/login', authController.login)

// user routes
route.post('/user', userController.create);
route.get('/user/:id', authenticateJWT, userController.getUserById)
route.get('/users', authenticateJWT, userController.getAll)
route.post('/user/follow/:id', authenticateJWT, userController.followUser)
route.post('/user/unfollow/:id', authenticateJWT,userController.unfollowUser)
route.delete('/user/:id', authenticateJWT, userController.delete)
route.get('/', (req, res) => res.send('Hello world'))

//upload.single('profilePicture'), 

// post routes
route.post('/post', upload.single('image'), postController.create)
route.get('/posts', postController.getAllPosts)
route.get('/posts/all', postController.getAllPostsOfFollowersAndFollowing)
route.get('/posts/followers', postController.getPostsOfFollowers)
route.get('/posts/following', postController.getPostsOfFollowing)
route.get('/posts/:id', postController.getUserPosts)

// message routes
route.post('/messages', messageController.sendMessage)
route.get('/messages/:userId', messageController.getMessages)

module.exports = route;
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const { uploadImage } = require('../services/cloudinaryService');
const fs = require('fs');
const { error } = require('console');

// Create user
exports.create = async (req, res) => {
    try {
        const { username, email, password, bio, accountStatus, socialLinks, role } = req.body;

        // Validate request body
        if (!req.body) {
            return res.status(400).send({ message: 'Body cannot be empty' });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ message: 'Email has already been registered' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl = '';
        if(req.file) {
            const transformationOptions = [
                { quality: 'auto', fetch_format: 'auto' }
            ]

            // upload image to cloudinary
            const uploadResult = await uploadImage(req.file.path, transformationOptions)
            imageUrl = uploadResult.secure_url

            // remove the temporary file from uploads folder
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting temporary file:', err);
                }
            });
        }

        // Create new user instance
        const user = new UserModel({
            username,
            email,
            password: hashedPassword,
            profilePicture: imageUrl,
            bio: bio || '',
            accountStatus: accountStatus || 'active',
            socialLinks: {
                facebook: socialLinks?.facebook || '',
                twitter: socialLinks?.twitter || '',
                instagram: socialLinks?.instagram || ''
            },
            role: role || 'user'
        });

        await user.save();
        res.status(201).send({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).send({ message: 'An error occurred while creating the user', error: error.message });
    }
}

// Get user by email
exports.getUserByEmail = async (email) => {
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        throw new Error('An error occurred while getting the user');
    }
};


exports.getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
            .populate('followers', 'username email profilePicture bio')
            .populate('following', 'username email profilePicture bio');

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: 'An error occurred while getting the user', error: error.message });
    }
}

// Get all users
exports.getAll = async (req, res) => {
    try {
        const users = await UserModel.find({})
            .select('username email profilePicture bio socialLinks')
            .populate('followers', 'username email profilePicture')
            .populate('following', 'username email profilePicture');

        if (users.length === 0) {
            return res.status(404).send({ message: 'User list is empty' });
        }

        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({ message: 'An error occurred while getting all users', error: error.message });
    }
}


// Delete user
exports.delete = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id); 

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        await UserModel.deleteOne({ _id: req.params.id });
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: 'An error occurred while deleting the user', error: error.message });
    }
}

// follow user
exports.followUser = async(req, res) => {
    try {
        const userIdToFollow = req.params.id
        const currentUserId = req.user._id

        console.log(userIdToFollow, currentUserId)

        const userToFollow = await UserModel.findById(userIdToFollow);
        const currentUser = await UserModel.findById(currentUserId)

        if (!userToFollow || !currentUser) {
            return res.status(404).send({ message: 'User not found' })
        }

        if(currentUser.following.includes(userIdToFollow)) {
            res.status(409).send({ message: 'Already following user' })
        }

        currentUser.following.push(userToFollow._id)
        userToFollow.followers.push(currentUser._id)

        await currentUser.save()
        await userToFollow.save()

        res.status(201).send({ message: `Now following ${userToFollow.username}` })
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: 'Failed to follow user', error: error.message })
    }
}

// unfollow user
exports.unfollowUser = async(req, res) => {
    try {
        const userIdToUnfollow = req.params.id
        const currentUserId = req.user._id;

        const userToUnfollow = await UserModel.findById(userIdToUnfollow)
        const currentUser = await UserModel.findById(currentUserId)

        if(!userToUnfollow || !currentUser) {
            return res.status(404).send({ message: 'User not found' })
        }

        currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToUnfollow)
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUserId)

        await currentUser.save()
        await userToUnfollow.save()

        res.status(201).send({ message: 'Unfollowed user', error: error.message })
    } catch (error) {
        res.status(400).send({ message: 'Failed to unfollow user', error: error.message })
    }
}

// get user followers
exports.getFollowers = async(req, res) => {

}

exports.getFollowing = async(req, res) => {

}

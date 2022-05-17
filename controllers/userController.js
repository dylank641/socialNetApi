const { User, Thought } = require('../models');


const userController = {
    // get all users
    getUsers(req, res) {
        User.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one User by id
    getOneUser({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => { 
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user was found related to this search.' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // create a user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user was found related to this search.' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    // delete a user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user was found related to this search.' });
                    return;
                }
                return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
            }).then(dbUserData => {
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    addFriend({ params }, res) {
        User.findOne({ _id: params.friendId })
            .then(dbFriendData => {
                if (!dbFriendData) {
                    res.status(404).json({ message: 'No friend was found related to this search.' });
                    return;
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { friends: params.friendId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No friend was found related to this search.' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    deleteFriend({ params }, res) {
        User.findOne({ _id: params.friendId })
            .then(dbFriendData => {
                console.log(dbFriendData)
                if (!dbFriendData) {
                    res.status(404).json({ message: 'No friend was found related to this search.' });
                    return;
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { friends: params.friendId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No friend was found related to this search.' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    }

};

module.exports = userController;
const router = require('express').Router();
const {
    getThoughts,
    getOneThought,
    createThought,
    updateThought,
    deleteThought,
    addComment,
    deleteComment
} = require('../controllers/thoughtController');


router
    .route('/')
    .get(getThoughts)
    .post(createThought);



router
    .route('/:id')
    .get(getOneThought)
    .put(updateThought)
    .delete(deleteThought);

router
    .route('/:thoughtId/reactions')
    .post(addComment);
router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteComment);


module.exports = router;
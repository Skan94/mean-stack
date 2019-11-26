const express = require('express');

const PostsController = require('../controllers/posts');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
router.get('',PostsController.getPosts);

router.post('',checkAuth,extractFile,PostsController.createPost)

router.delete('/:id',checkAuth,PostsController.deletePostById);
router.put('/:id',checkAuth,extractFile,PostsController.updatePost);
router.get('/:id',PostsController.getPostById);

module.exports = router;

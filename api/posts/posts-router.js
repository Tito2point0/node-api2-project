
const express = require('express')

const Post = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
    Post.find()
        .then(found => {
    //   console.log('found posts:', found)
        res.json(found)
        })
        .catch(err => {
            // console.log('error retrieving posts:', err)
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack,
        })
    })
})
router.get('/:id', async (req, res) => {
    try {
    const post = await  Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist" 
        })
        } else {
            res.json(post)
    }
     }
    catch (err) {

        res.status(500).json({
            message: "The post information could not be retrieved",
            err: err.message,
            stack: err.stack,
        })
    }
})
router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        })
    } else {
        Post.insert({ title, contents })
            .then(({ id }) => {
              return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err.message,
                    stack: err.stack
                })
            })
    }
})
router.delete('/:id',  async (req, res) => {
    try {
        const maybe = await Post.findById(req.params.id)
        if (!maybe) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            // const deletePost =  
            await Post.remove(req.params.id)
            res.json(maybe)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message,
            stack: err.stack
        })
}
})
router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        })
    } else {
        Post.findById(req.params.id)
            .then(putInfo => {
                if (!putInfo) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else {
                    return Post.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                   return Post.findById(req.params.id)
               }
            })
            .then(post => {
                if (post) {
                   res.json(post)
               }
            })
            .catch(err => {
                res.status(500).json({
                    message: "The post information could not be modified",
                    err: err.message,
                    stack: err.stack,
            })
            
        })
    }
})
router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const comments = await Post.findPostComments(req.params.id)
            res.json(comments)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            err: err.message,
            stack: err.stack,
        })
    }
})
// router.verb('/', (req, res) => {

// })

module.exports = router
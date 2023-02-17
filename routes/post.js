const moment = require("moment")

const Post = (userService, postService) => {
    // get post data
    const getPostData = async (req, res) => {
        const {post_id} = req.params
        let post = await postService.getPostById(post_id)
        if(post !== null){
            post = {...post, post_created: moment(post.post_created).fromNow()}
        }
        let comments = await postService.getCommentsForPost(post_id)
        if(comments !== null){
            comments = comments.map(comment => {
                return {...comment, comment_created: moment(comment.comment_created).fromNow()}
            })
        }
        res.render("pages/post", {
            post,
            comments,
            badges: req.badges
        })
    }

    // make a comment
    const makeComment = async (req, res) => {
        const {comment_parent} = req.params
        const {id} = req.user
        try {
            const data = {...req.body, comment_parent, comment_author: id}
            await postService.makeComment(data)
        } catch (error) {
            req.flash("error", "Oops something went wrong")
            console.log(`${id}: ${fullname}`, "=>", error.stack)
        } finally {
            res.redirect("back")
        }
    }

    // comments have replies

    // get replies of comment
    const getCommentData = async (req, res) => {
        let {post_id, comment_id} = req.params
        let comment = await postService.getCommentById(comment_id)
        if(comment !== null){
            comment = {...comment, comment_created: moment(comment.comment_created).fromNow()}
        }
        let replies = await postService.getRepliesForComment(comment_id)
        if(replies != null) {
            replies = replies.map(reply => {
                return {...reply, reply_created: moment(reply.reply_created).fromNow()}
            })
        }
        res.render("pages/reply", {
            comment,
            replies,
            post_id,
            badges: req.badges
        })
    }

    // make a reply
    const makeReply = async (req, res) => {
        const {reply_parent} = req.params
        const {id} = req.user
        try {
            const data = {...req.body, reply_parent, reply_author: id}
            await postService.makeReply(data)
        } catch (error) {
            req.flash("error", "Oops something went wrong")
            console.log(`${id}: ${fullname}`, "=>", error.stack)
        } finally {
            res.redirect("back")
        }
    }

    return {
        getPostData,
        makeComment,
        getCommentData,
        makeReply
    }
}

module.exports = Post
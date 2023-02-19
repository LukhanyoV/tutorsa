const moment = require("moment")

const Pages = (postService) => {
    const getHome = async (req, res) => {
        const {fullname, id} = req.user
        // let posts = await postService.getAllPosts()
        let limit = 10
        let posts = await postService.getPostsPerPage(req.query.limit || limit, req.query.page || 1)
        if(posts !== null){
            posts = posts.map(post => {
                return {...post, post_created: moment(post.post_created).fromNow()}
            })
        } else {
            posts = []
        }
        res.render("pages/home", {
            fullname,
            posts,
            badges: req.badges
        })
    }

    return {
        getHome
    }
}

module.exports = Pages
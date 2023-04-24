const moment = require("moment")

const Pages = (postService) => {
    const getHome = async (req, res) => {
        const {fullname, id, account_type} = req.user
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
        // pagination
        const currentPage = req.query.page || 1
        const prevPage = currentPage > 1 && +currentPage-1
        const nextPage = !(posts.length < limit) && +currentPage+1 // better than checking the next page
        res.render("pages/home", {
            fullname,
            posts,
            isTutor: account_type === "tutor",
            isStudent: account_type === "student",
            badges: req.badges,

            currentPage,
            prevPage,
            nextPage
        })
    }

    return {
        getHome
    }
}

module.exports = Pages
const PostService = (db) => {
    // get all available posts
    const getAllPosts = async () => {
        return await db.manyOrNone("SELECT * FROM posts INNER JOIN members ON members.id = posts.post_author ORDER BY post_created DESC")
    }
    // get post by the id
    const getPostById = async (post_id) => {
        return await db.oneOrNone("SELECT * FROM posts INNER JOIN members ON members.id = posts.post_author WHERE post_id = $1", [post_id])
    }

    // get all the comments of a post by the id
    const getCommentsForPost = async (post_id) => {
        return await db.manyOrNone("SELECT * FROM comments INNER JOIN posts ON posts.post_id = comments.comment_parent INNER JOIN members ON members.id = comments.comment_author WHERE comment_parent = $1 ORDER BY comment_created DESC", [post_id])
    }

    // make a comment to a post
    const makeComment = async({comment_author, comment_text, comment_parent}) => {
        await db.none("INSERT INTO comments (comment_author, comment_text, comment_parent) VALUES($1, $2, $3)", [comment_author, comment_text, comment_parent])
    }

    // get comment by id
    const getCommentById = async (comment_id) => {
        return await db.oneOrNone("SELECT * FROM comments INNER JOIN members ON members.id = comments.comment_author WHERE comment_id = $1", [comment_id])
    }

    // get all the replies of the comment by id
    const getRepliesForComment = async (comment_id) => {
        return await db.manyOrNone("SELECT * FROM replies INNER JOIN comments ON comments.comment_id = replies.reply_parent INNER JOIN members ON members.id = replies.reply_author WHERE reply_parent = $1 ORDER BY reply_created DESC", [comment_id])
    }

    // make a reply to a comment
    const makeReply = async ({reply_author, reply_text, reply_parent}) => {
        return await db.none("INSERT INTO replies (reply_author, reply_text, reply_parent) VALUES ($1, $2, $3)", [reply_author, reply_text, reply_parent])
    }

    // get post likes
    const getPostLikes = async (post_id) => {
        const results = await db.one("SELECT COUNT(*) FROM liked WHERE liked_post = $1", [post_id])
        return results.count
    }

    // like a post
    const likePost = async ({liked_post, liked_by}) => {
        if(await db.oneOrNone("SELECT * FROM liked WHERE liked_post = $1 AND liked_by = $2", [liked_post, liked_by])) return
        return await db.none("INSERT INTO liked (liked_post, liked_by) VALUES($1, $2)", [liked_post, liked_by])
    }

    return {
        getAllPosts,
        getPostById,
        getCommentsForPost,
        makeComment,
        getCommentById,
        getRepliesForComment,
        makeReply,
        getPostLikes,
        likePost
    }
}

module.exports = PostService
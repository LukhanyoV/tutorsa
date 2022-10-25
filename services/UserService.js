const UserService = (db) => {
    // POSTS
    // make a post
    const makePost = async ({post_author, post_text}) => {
        await db.none("INSERT INTO posts (post_author, post_text) VALUES($1, $2)", [post_author, post_text])
    }

    // get my posts
    const getMyPosts = async (post_author) => {
        return await db.manyOrNone("SELECT * FROM posts INNER JOIN members ON members.id = posts.post_author WHERE post_author = $1 ORDER BY post_created DESC", [post_author])
    }

    // MESSAGES
    // get messages
    const getMessages = async (sender, receiver) => {
        await db.none("UPDATE messages SET message_read = 't' WHERE message_sender = $2 AND message_receiver = $1 AND message_read = 'false'", [sender, receiver])
        return await db.manyOrNone("SELECT mA.fullname AS sender_name, mA.id AS sender_id, mB.fullname AS receiver_name, mB.id AS receiver_id, message_text, message_created FROM messages INNER JOIN members AS mA ON mA.id = messages.message_sender INNER JOIN members AS mB ON mB.id = messages.message_receiver WHERE (message_sender = $1 AND message_receiver = $2) OR (message_sender = $2 AND message_receiver = $1) ORDER BY message_created DESC", [sender, receiver])
    }

    // create message
    const sendMessage = async ({message_sender, message_receiver, message_text}) => {
        return await db.none("INSERT INTO messages (message_sender, message_receiver, message_text) VALUES ($1, $2, $3)", [message_sender, message_receiver, message_text])
    }

    // get past messages
    const getPastMessages = async (user) => {
        return await db.manyOrNone(`
        SELECT mA.fullname AS sender_name, mA.id AS sender_id, mB.fullname AS receiver_name, mB.id AS receiver_id, message_text, message_created, message_read FROM messages 
        INNER JOIN members AS mA 
        ON mA.id = messages.message_sender 
        INNER JOIN members AS mB 
        ON mB.id = messages.message_receiver 
        WHERE message_sender = $1 OR message_receiver = $1
        ORDER BY message_created DESC
        `, [user])
    }

    return {
        makePost,
        getMyPosts,
        getMessages,
        sendMessage,
        getPastMessages
    }
}

module.exports = UserService
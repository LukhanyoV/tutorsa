const moment = require("moment")

const User = (userService, usersService) => {
    // get user profile
    const profile = async (req, res) => {
        let {fullname, id, account_type} = req.user
        let {profile_id} = req.params
        let posts = await userService.getMyPosts(profile_id || id)
        let notMe = !profile_id ? false : profile_id != id
        if(profile_id){
            let user = await usersService.findById(profile_id)
            fullname = user.fullname
            account_type = user.account_type
        }
        if(posts !== null){
            posts = posts.map(post => {
                return {...post, post_created: moment(post.post_created).fromNow()}
            })
        } else {
            posts = []
        }
        res.render("pages/profile", {
            fullname,
            posts,
            account_type,
            profile_id,
            notMe
        })
    }

    // make a post
    const makePost = async (req, res) => {
        const {fullname, id} = req.user
        try {
            req.body = {...req.body, post_author: id}
            await userService.makePost(req.body)
        } catch (error) {
            req.flash("error", "Oops something went wrong")
            console.log(`${id}: ${fullname}`, "=>", error.stack)
        } finally {
            res.redirect("/profile")
        }
    }

    // show message
    const showMessages = async (req, res) => {
        const {id} = req.user
        const {user_id} = req.params
        let user = await usersService.findById(user_id)
        let messages = await userService.getMessages(id, user_id)
        if(messages) {
            messages = messages.map(message => {
                let current_user = message.sender_id == id
                return {...message, current_user: current_user, message_created: moment(message.message_created).fromNow()}
            })
        }
        res.render("pages/message", {
            friend: user.fullname,
            messages,
            user_id,
            account_type: user.account_type,
            msg: messages !== null
        })
    }

    // send a message
    const sendMessage = async (req, res) => {
        const {id, fullname} = req.user
        const {user_id} = req.params
        try {
            req.body = {...req.body, message_sender: id, message_receiver: user_id}
            await userService.sendMessage(req.body)
        } catch (error) {
            req.flash("error", "Oops something went wrong")
            console.log(`${id}: ${fullname}`, "=>", error.stack)
        } finally {
            res.redirect("back")
        }
    }

    // past messaged people
    const pastMessages = async (req, res) => {
        const {id, fullname} = req.user
        const pastMsg = await userService.getPastMessages(id)
        const isVisible = pastMsg.length > 0
        const msgMap = {}
        pastMsg.forEach(msg => {
            let key, id
            if(msg.sender_name !== fullname){
                key = msg.sender_name
                id = msg.sender_id
            } else {
                key = msg.receiver_name
                id = msg.receiver_id
            }
            if(msgMap[key] === undefined){
                msgMap[key] = {
                    id,
                    lastText: msg.message_text,
                    time: moment(msg.message_created).fromNow(),
                    unread: 0
                }
            }
            if(msg.message_read === false && msg.receiver_id !== id) msgMap[key]['unread']++
        })
        res.render("pages/messages", {
            msgMap,
            isVisible
        })
    }

    return {
        profile,
        makePost,
        showMessages,
        sendMessage,
        pastMessages
    }
}

module.exports = User
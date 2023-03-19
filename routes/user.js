const moment = require("moment")
const calcAverageRating = (ratings) => {
    let totalWeight = 0
    let totalReviews = 0

    ratings.forEach((rating) => {
        totalWeight += rating.weight * +rating.count
        totalReviews += +rating.count
    })

    const averageRating = totalWeight / totalReviews

    return averageRating ? averageRating.toFixed(2) : "No "
}

const User = (userService, usersService, bookingService) => {
    // get user profile
    const profile = async (req, res) => {
        let {fullname, id, account_type} = req.user
        let {profile_id} = req.params
        if(profile_id){
            let user = await usersService.findById(profile_id)
            fullname = user.fullname
            account_type = user.account_type
        }
        let ratings
        if(account_type === "tutor"){
            ratings = await bookingService.getTutorRating(profile_id || id)
        }
        let limit = 10
        let posts = await userService.getMyPostsPerPage(profile_id || id, req.query.limit || limit, req.query.page || 1)
        let notMe = !profile_id ? false : profile_id != id
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
        res.render("pages/profile", {
            fullname,
            posts,
            account_type,
            profile_id,
            isTutor: account_type === "tutor",
            rating: ratings ? calcAverageRating(ratings):null,
            notMe,
            badges: req.badges,

            currentPage,
            prevPage,
            nextPage
        })
    }

    // get edit user profile
    const editProfile = async (req, res) => {
        const {fullname, email, account_type, id} = req.user
        const profile = {fullname, email}
        
        const tutorSubjects = await bookingService.getTutorSubjects(id)
        res.render("pages/editprofile", {
            profile,
            isTutor: account_type === "tutor",
            isStudent: account_type === "student",
            badges: req.badges,
            tutorSubjects
        })
    }

    // update profile data
    const updateProfile = async (req, res) => {
        res.redirect("back")
    }
    
    // get add subjects page
    const getAddSubjects = async (req, res) => {
        const {account_type, id} = req.user
        const num = /[0-9]/g.test(req.query.num) && ~~+req.query.num > 0 && ~~+req.query.num
        const fields = num ? new Array(num).fill("nothing").map((v,i) => i+1) : []
        const subjects = await bookingService.getSubjects()
        const grades = await bookingService.getGrades()
        res.render("pages/addsubjects", {
            isTutor: account_type === "tutor",
            num,
            fields,
            subjects,
            grades,
            badges: req.badges
        })
    }

    // add tutor subjects
    const addSubjects = async (req, res) => {
        const {id} = req.user
        for(let i = 1; i <= Number(req.body.num); i++){
            // let grades = Array.isArray(req.body[`grades${i}`]) ? req.body[`grades${i}`] : [req.body[`grades${i}`]]
            let grades = [req['body'][`grades${i}`]]['flat']()
            for(let j = 0; j < grades.length; j++){
                console.log('subject id', req.body[`subject${i}`], '==>', 'grade id', grades[j])
                await bookingService.addTutorSubject(+id, +req.body[`subject${i}`], +grades[j])
            }
        }
        res.redirect("/profile/edit")
    }

    // remove tutor suject
    const removeSubject = async (req, res) => {
        const {id} = req.user
        const {key}  =  req.body
        await bookingService.removeTutorSubject(+key, id)
        res.redirect("back")
    }

    // get rate tutor
    const rateTutor = async (req, res) => {
        const {tutor_id} = req.params
        const {account_type, fullname, id} = await usersService.findById(tutor_id)
        res.render("pages/ratetutor", {
            id,
            fullname,
            isTutor: account_type === "tutor",
            badges: req.badges
        })
    }

    // send tutor rating
    const sendRating = async (req, res) => {
        const {tutor, rating, feedback} = req.body
        const {id, fullname} = req.user
        try {
            await bookingService.rateTutor(tutor, id, rating, feedback)
        } catch (error) {
            req.flash("error", "Oops something went wrong")
            console.log(`${id}: ${fullname}`, "=>", error.stack)
        } finally {
            res.redirect("/profile/"+tutor)
        }
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
            msg: messages !== null,
            badges: req.badges
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
            isVisible,
            badges: req.badges
        })
    }

    return {
        profile,
        editProfile,
        updateProfile,
        rateTutor,
        sendRating,
        makePost,
        showMessages,
        sendMessage,
        pastMessages,
        getAddSubjects,
        addSubjects,
        removeSubject
    }
}

module.exports = User
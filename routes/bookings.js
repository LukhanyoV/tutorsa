const formatDate = date => {
    const whole = n => n > 9 ? n : "0" + n
    return `${date.getFullYear()}-${whole(date.getMonth() + 1)}-${whole(date.getDate())}`
}

const keyAndName = arr => {
    return arr.map((v, i) => {
        return {
            key: i+1,
            name: v
        }
    })
}

const Bookings = (bookingService, usersService) => {
    const checkBookings = async (req, res) => {
        const {id: user, account_type} = req.user
        // separate to pending, accepted, rejected, complete
        let bookings = await bookingService.getUserBookings(user)
        bookings = bookings.map(booking => {
            let updates = []
            if(booking.status === "pending" && account_type === "tutor"){
                updates = ["accept", "reject"]
                return {...booking, updates: keyAndName(updates)}
            } else if(account_type === "student"){
                if(booking.status === "accepted"){
                    return {...booking, 
                        updates: [
                            {
                                key: 1,
                                name: "cancel"
                            },
                            {
                                key: 2,
                                name: "complete"
                            }
                        ]
                    }
                }
                return {...booking}
            } else {
                return {...booking}
            }
        })
        res.render("pages/bookings", {
            isStudent: account_type === "student",
            isTutor: account_type === "tutor",
            bookings,
            badges: req.badges,
            helpers: {
                formatDate: date => new Date(date).toDateString()
            }
        })
    }
    
    const searchForTutor = async (req, res) => {
        const {account_type} = req.user
        const {subject, grade} = req.query
        const subjects = await bookingService.getSubjects()
        const grades = await bookingService.getGrades()
        let searchResults = (subject || grade) ? await bookingService.searchForTutor(subject, grade) : []
        res.render("pages/searchresults", {
            isStudent: account_type === "student",
            searchResults,
            subjects,
            grades,
            badges: req.badges
        })
    }

    const bookTutor = async (req, res) => {
        const {tutor_id} = req.params
        const tutor = await usersService.findById(tutor_id)
        const tutorSubjects = await bookingService.getTutorSubjects(tutor_id)
        res.render("pages/booking", {
            fullname: tutor.fullname,
            tutorSubjects,
            minDate: formatDate(new Date()),
            badges: req.badges
        })
    }

    const createBooking = async (req, res) => {
        try {
            const {id} = req.user
            const {item, date} = req.body
            if(item && date){
                await bookingService.createBooking(id, +item, date)
            }
        } catch (error) {
            console.log(error.stack)
        } finally {
            res.redirect("/bookings")
        }
    }

    const updateBooking = async (req, res) => {
        const {id, account_type} = req.user
        const {key, update, feedback} = req.body
        if(account_type === "tutor"){
            if(update == 1){
                await bookingService.updateBookingStatus(+key, "accepted", feedback, id)
            } else if(update == 2){
                await bookingService.updateBookingStatus(+key, "rejected", feedback, id)
            }
        } else if(account_type === "student"){
            if(update == 1){
                await bookingService.updateBookingStatus(+key, "cancelled", feedback, id)
            } else if(update == 2){
                await bookingService.updateBookingStatus(+key, "completed", feedback, id)
            }
        }
        res.redirect("back")
    }

    return {
        checkBookings,
        bookTutor,
        searchForTutor,
        createBooking,
        updateBooking
    }
}

module.exports = Bookings
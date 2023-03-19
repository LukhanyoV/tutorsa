const Bookings = (bookingService) => {
    const checkBookings = async (req, res) => {
        const {account_type} = req.user
        res.render("pages/bookings", {
            isStudent: account_type === "student",
            badges: req.badges
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
        res.render("pages/booking", {
            badges: req.badges
        })
    }

    return {
        checkBookings,
        bookTutor,
        searchForTutor
    }
}

module.exports = Bookings
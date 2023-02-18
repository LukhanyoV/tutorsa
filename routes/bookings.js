const Bookings = (bookingService) => {
    const checkBookings = async (req, res) => {
        res.render("pages/bookings", {
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
        bookTutor
    }
}

module.exports = Bookings
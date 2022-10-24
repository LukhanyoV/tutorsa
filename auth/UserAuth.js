const UserAuth = () => {
    // check user authentication
    const checkAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
        return next()
        }
    
        res.redirect('/login')
    }
    
    const checkNotAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    }

    return {
        checkAuthenticated,
        checkNotAuthenticated
    }
}

module.exports = UserAuth
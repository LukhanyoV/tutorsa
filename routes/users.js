const bcrypt = require("bcrypt")

const Users = (usersService) => {
    const getLogin = async (req, res) => {
        res.render("auth/login")
    }

    const postLogin = async (req, res) => {
        passport.authenticate('local', {
            successRedirect: '/home',
            failureRedirect: '/login',
            failureFlash: true
        })
    }

    const getRegister = async (req, res) => {
        res.render("auth/register")
    }

    const postRegister = async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = {...req.body, password: hashedPassword}
            const results = await usersService.registerUser(user)
            if(results){
                req.flash("success", "Account created successfully")
            } else {
                req.flash("error", "Email has already been taken")
            }
        } catch (error) {
            console.log(error.stack)
            req.flash("error", "Unknown error has occured")
        }
        res.redirect("/register")
    }

    const logoutUser = (req, res) => {
        req.logOut(function(err) {
            if (err) { 
              return next(err); 
            }
            req.flash("success", "You have logged out")
            res.redirect('/login');
        })
    }

    return {
        getLogin,
        postLogin,
        getRegister,
        postRegister,
        logoutUser
    }
}

module.exports = Users
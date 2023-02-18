// install express with `npm install express` 
const express = require("express")
const exphbs = require("express-handlebars")
const cors = require("cors")
const session = require("express-session")
const flash = require("express-flash")
const app = express()

// import database config
const db = require("./db/connect")
const passport = require("passport")

// configure default engine
app.engine("handlebars", exphbs.engine({defaultLayout: "main"}))
app.set("view engine", "handlebars")

// setup middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use(session({
    store: new (require("connect-pg-simple")(session))({
        pgPromise: db
    }),
    secret: "mycatwalkedonmykeyboard",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 86400 * 1000
    }
}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

// configure services
const usersService = require("./services/UsersService")(db)
const userServive = require("./services/UserService")(db)
const postService = require("./services/PostService")(db)
const bookingService = require("./services/BookingServices")(db)

// configure the routes and auth pages
const users = require("./routes/users")(usersService)
const pages = require("./routes/pages")(postService)
require("./services/PassportConfig")(passport, usersService)
const { checkAuthenticated, checkNotAuthenticated } = require("./auth/UserAuth")()

// comfigure user service (for individual user actions)
const user = require("./routes/user")(userServive, usersService)

// configure the post service
const post = require("./routes/post")(userServive, postService)

// configure booking service 
const book = require("./routes/bookings")(bookingService)

// badge count
app.use(async (req, res, next) => {
    if(req.user){
        const {id} = req.user
        const {count} = await userServive.unreadMessageBadge(id)
        req.badges = {...req.badges, unreadMsgs: count}
    }
    next()
})

// main page
app.get("/", (req, res) => res.render("index", {
    layout: "dashboard",
}))

// user authentication pages
app.get("/login", checkNotAuthenticated, users.getLogin)
app.post("/login", checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}))
app.get("/register", checkNotAuthenticated, users.getRegister)
app.post("/register", checkNotAuthenticated, users.postRegister)
app.post("/logout", users.logoutUser)

// profile page
app.get("/profile", checkAuthenticated, user.profile)
app.get("/profile/edit", checkAuthenticated, user.editProfile)
app.post("/profile/edit", checkAuthenticated, user.updateProfile)
app.get("/profile/:profile_id", checkAuthenticated, user.profile)
app.post("/post", checkAuthenticated, user.makePost)

// protected routes
app.get("/home", checkAuthenticated, pages.getHome)
app.get("/post/:post_id", checkAuthenticated, post.getPostData)
app.post("/comment/:comment_parent", checkAuthenticated, post.makeComment)

app.get("/post/:post_id/comment/:comment_id", checkAuthenticated, post.getCommentData)
app.post("/reply/:reply_parent", checkAuthenticated, post.makeReply)

app.get("/messages", checkAuthenticated, user.pastMessages)
app.get("/message/:user_id", checkAuthenticated, user.showMessages)
app.post("/message/:user_id", checkAuthenticated, user.sendMessage)

app.get("/rate/:tutor_id", checkAuthenticated, user.rateTutor)
app.post("/rate", checkAuthenticated, user.sendRating)

app.get("/book/:tutor_id", checkAuthenticated, book.bookTutor)
app.get("/bookings", checkAuthenticated, book.checkBookings)

// export "app"
module.exports = app

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 App running at PORT: ${PORT}`))
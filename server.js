const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const mongo = require('./module/mongo')

const UserRoute = require('./routes/UserRoute')
const NewsRoute = require('./routes/NewsRoute')
const AddnewsRoute = require('./routes/AddnewsRoute')
const MypostsRoute = require('./routes/MypostsRoute')
const SignupRoute = require('./routes/SignupRoute')
const ProfileRoute = require('./routes/ProfileRoute')
const SettingsRoute = require('./routes/SettingsRoute')


const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')))

app.set('view engine', 'ejs')

;
(async function () {
    const db = await mongo()
    await app.use((req, res, next) => {
        req.db = db
        next()
    })
    await app.use(NewsRoute.path, NewsRoute.router)
    await app.use(UserRoute.path, UserRoute.router)
    await app.use(SignupRoute.path, SignupRoute.router)
    await app.use(AddnewsRoute.path, AddnewsRoute.router)
    await app.use(MypostsRoute.path, MypostsRoute.router)
    await app.use(ProfileRoute.path, ProfileRoute.router)
    await app.use(SettingsRoute.path, SettingsRoute.router)


    app.get("/logout", async (req, res) => {
        console.log(req.cookies.token);
        res.clearCookie('token').redirect('/')
    })


})();


app.listen(5555, () => {
    console.log('Server is running on 3566');
})
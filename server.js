const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const mongo = require('./module/mongo')

const UserRoute = require('./routes/UserRoute')
const NewsRoute = require('./routes/NewsRoute')


const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')))

app.set('view engine', 'ejs')

;(async function () {
    const db = await mongo()
    await app.use((req, res, next) => {
        req.db = db
        next()
    })
    await app.use(UserRoute.path, UserRoute.router)
    await app.use(NewsRoute.path, NewsRoute.router)

})();


app.listen(3566, () =>{
    console.log('Server is running on 3566');
})

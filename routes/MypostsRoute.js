const router = require('express').Router();
const title = 'Mening postlarim'
const {
    createToken,
    checkToken
} = require('../module/jwt');


async function AuthUserMiddleware(req, res, next) {
    if (!req.cookies.token) {
        res.redirect('/login')
        return;
    }

    const isTrust = checkToken(req.cookies.token)

    if (isTrust) {
        req.user = isTrust
        next()
    } else {
        res.redirect('/login')
        return;
    }
}

async function getUser(req){
    const isTrust = checkToken(req.cookies.token)
    req.user = isTrust

    let user = await req.db.users.findOne({
        email: req.user.email,
    })

    return user
}


router.get('/', async (req, res) => {

    const user = await getUser(req)

    const myPosts = await req.db.posts.find({
        posterId: user._id
    } ).toArray()

    const userPosts = myPosts.reverse()

    res.render('myposts', {
        title,
        userPosts
    })

})

module.exports = {
    path: '/myposts',
    router
}
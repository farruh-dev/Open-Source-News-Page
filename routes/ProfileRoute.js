const router = require('express').Router();
const title = 'Mening postlarim'
const { ObjectId } = require('bson');
const {
    createToken,
    checkToken
} = require('../module/jwt');


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

    const profile = await req.db.users.find({
        _id: ObjectId(user._id)
    } ).toArray()

    const myPosts = await req.db.posts.find({
        posterId: user._id
    } ).toArray()
    

    res.render('profile', {
        title,
        profile,
        myPosts
    })

})

module.exports = {
    path: '/profile',
    router
}
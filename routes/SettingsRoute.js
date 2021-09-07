const router = require('express').Router();
const title = 'Sozlamalar'
const {
    ObjectId
} = require('bson');
const expressFileUpload = require('express-fileupload')
const {
    createToken,
    checkToken
} = require('../module/jwt');
const fs = require('fs').promises;
const path = require('path');


async function getUser(req) {
    const isTrust = await checkToken(req.cookies.token)
    req.user = isTrust

    let user = await req.db.users.findOne({
        email: req.user.email,
    })

    return user
}


router.get('/', async (req, res) => {

    const user = await getUser(req)

    console.log(user);

    const profile = await req.db.users.findOne({
        _id: ObjectId(user._id)
    })

    const myPosts = await req.db.posts.find({
        posterId: user._id
    }).toArray()


    res.render('settings', {
        title,
        profile,
        myPosts
    })

})

router.post('/', expressFileUpload(), async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    const {
        newName,
        newEmail
    } = req.body

    const user = await getUser(req)

    const directory = path.join(__dirname, '..', 'public', 'userPhoto', user.name + '|' + user.email);

    await fs.mkdir(directory, {
        recursive: true
    })

    await req.files.userphoto.mv(path.join(directory, req.files.userphoto.name))

    let myQuery = {_id: ObjectId(user._id)}

    let newvalues = { $set: { userphoto: req.files.userphoto.name } };

    await req.db.users.updateOne(myQuery, newvalues)

    res.redirect('/settings')

    // await res.clearCookie('token')

    // const token = await createToken({
    //     user_id: user._id,
    //     email: user.email
    // })


    // res.cookie('token', token).redirect('/settings')
    // console.log('cookies added', await token);

})

module.exports = {
    path: '/settings',
    router
}
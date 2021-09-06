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

    const directory = path.join(__dirname, '..', 'public', 'userPhoto');

    const checkFolder = await fs.readdir(directory, 'utf-8')

    if (checkFolder.length > 0 || checkFolder.includes('userphoto.png')) {
        await fs.readdir(directory, async (err, files) => {
            if (err) throw err;

            for (const file of files) {
                await fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });

    }

    await req.files.userphoto.mv(path.join(__dirname, '..', 'public', 'userPhoto', 'userphoto.png'))

    // await req.db.users.updateOne({
    //     _id: ObjectId(user._id)
    // }, {
    //     $set: {
    //         name: newName,
    //         email: newEmail
    //     }
    // })

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
const router = require('express').Router();
const title = 'Yangilik qo`shish'
const {
    createToken,
    checkToken
} = require('../module/jwt');
const expressFileUpload = require('express-fileupload')
const path = require('path');


async function getUser(req) {
    const isTrust = checkToken(req.cookies.token)
    req.user = isTrust

    let user = await req.db.users.findOne({
        email: req.user.email,
    })

    return user
}


router.get('/', (req, res) => {

    res.render('addnews', {
        title,
    })

})

router.post('/', expressFileUpload(), async (req, res) => {
    const {
        heading,
        category,
        more,
        tags
    } = req.body
    const {
        linkname,
        link,
        linkname2,
        link2,
        linkname3,
        link3
    } = req.body
    let {
        placeholder
    } = req.body

    const date = new Date()

    const currentDate = `${date.getDay()}.${date.getMonth()}.${date.getFullYear()} soat ${date.getHours()}:${date.getMinutes()}`

    const user = await getUser(req)

    function getWordStr(str) {
        return str.split(/\s+/).slice(0, 10).join(" ") + '...';
    }

    if (!(heading && more)) {
        res.render('addnews', {
            title,
            error: "Barcha bo'shliqlarni to'ldiring!"
        })
        return
    }


    if (tags.length == 0) {
        res.render('addnews', {
            title,
            error: "Iltimos, kamida 1 dona kalit so'z kiriting!"
        })
        return
    }
    const short = getWordStr(more)

    let photo = placeholder

    if (req.files) {
        if (req.files.photo) {
            req.files.photo.mv(path.join('public', 'uploadedPhotos', req.files.photo.name))
            photo = req.files.photo.name
        }
    }

    let links = []

    if((linkname, link) && (linkname2, link2) && (linkname3,  link3)){
        links.push({
            linkname,
            link
        }, {
            linkname2,
            link2
        }, {
            linkname3,
            link3
        })
    }

    if (!(linkname, link) && !(linkname2, link2) && (linkname3, link3)) {
        links.push({
            linkname3,
            link3
        })
    }
    if (!(linkname, link) && !(linkname3, link3) && (linkname2, link2)) {
        links.push({
            linkname2,
            link2
        })
    }
    if (!(linkname3, link3) && !(linkname2, link2) && (linkname, link)) {
        links.push({
            linkname,
            link
        })
    }
    if ((linkname, link) && (linkname2, link2) && !(linkname3, link3)) {
        links.push({
            linkname,
            link
        }, {
            linkname2,
            link2
        })
    }
    if ((linkname, link) && (linkname3, link3) && !(linkname2, link2)) {
        links.push({
            linkname,
            link
        }, {
            linkname3,
            link3
        })
    }
    if ((linkname3, link3) && (linkname2, link2) && !(linkname, link)) {
        links.push({
            linkname2,
            link2
        }, {
            linkname3,
            link3
        })
    }




    console.log(links);

    let newPost = {
        ID: Math.random().toString(32).substring(2),
        posterId: user._id,
        posterName: user.name,
        heading,
        category,
        short,
        more,
        addedTime: currentDate,
        photo,
        tags: tags.split(' '),
        links: links
    }

    console.log(newPost);

    await req.db.posts.insertOne({
        ...newPost
    })

    res.redirect("/myposts")
})

module.exports = {
    path: '/addnews',
    router
}
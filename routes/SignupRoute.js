const { createCrypt, compareCrypt } = require('../module/bcrypt');
const { createToken, checkToken } = require('../module/jwt');


const router = require('express').Router();

router.get('/', (req, res) =>{
    res.render('register',{
        title: 'Sign up'
    })
})


router.post('/', async (req, res) =>{
    const {name, email, password, confpassword} = req.body

    if(!(name && email && password && confpassword)){
        res.render('register', {
            title: 'Sign up',
            error: 'Fill in all empty areas!'
        })
        return;
    }

    if(confpassword != password){
        res.render('register',{
            title: 'Sign up',
            error: 'Password confirmation did not match !'
        })
        return;
    }

    let user = await req.db.users.findOne({
        email: email.toLowerCase(),
    })

    if(user && name == user.name){
        res.render('register', {
            title: 'Sign up',
            error: 'User with this name already exist'
        })
        return;
    }
    else if(user && email == user.email){
        res.render('register', {
            title: 'Sign up',
            error: 'User with this email already exist'
        })
        return;
    }

    if(!user){
        user = await req.db.users.insertOne({
            name,
            email: email.toLowerCase(),
            password: await createCrypt(password),
            userphoto: 'userphoto.png'
        })
    
        res.redirect('/')
    }
})

module.exports = {
    path: '/signup',
    router
}
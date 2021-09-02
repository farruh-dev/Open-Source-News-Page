const { createCrypt, compareCrypt } = require('../module/bcrypt');
const { createToken, checkToken } = require('../module/jwt');


const router = require('express').Router();

router.get('/', (req, res)=>{

    if(!req.cookies.token){
        res.render('login',{
            title: 'Login'
        })
        return;
    }
    const isTrust = checkToken(req.cookies.token)

    if(isTrust){
        req.user = isTrust
        res.redirect('/news')
    }else{
        res.redirect('/')
        return
    }
})

router.post('/', async (req, res) =>{
    const {email, password} = req.body

    if(!(email && password )){
        res.render('login', {
            title: 'Login',
            error: 'Fill in all empty areas!'
        })
        return;
    }


    let user = await req.db.users.findOne({
        email: email.toLowerCase(),
    })

    if(!user){
        res.render('login', {
            title: 'Login',
            error: 'User not found!'
        })
        return;
    }
    if(!(await compareCrypt(user.password, password))){
        res.render('login', {
            title: 'Login',
            error: 'Password is incorrect!'
        })
        return;
    }

    const token = createToken({
        user_id: user._id,
        email: user.email
    })

    res.cookie('token', token).redirect('/news')
    
})

router.get('/signup', (req, res) =>{
    res.render('register',{
        title: 'Sign up'
    })
})


router.post('/signup', async (req, res) =>{
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
            posts: [],
        })
    
        res.redirect('/')
    }
})


router.get("/logout", async(req, res) =>{
    console.log(req.cookies.token);
    res.clearCookie('token').redirect('/')
})



module.exports = {
    router,
    path: '/'
}
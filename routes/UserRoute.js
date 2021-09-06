const { createCrypt, compareCrypt } = require('../module/bcrypt');
const { createToken, checkToken } = require('../module/jwt');


const router = require('express').Router();

router.get('/', (req, res)=>{
    res.render('login', {
        title: "Login"
    })
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

    console.log(user);

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

    if (user) {
        const token = await createToken({
            user_id: user._id,
            email: user.email
        })
    
        
        res.cookie('token', await token).redirect('/news')
        console.log('cookies added', await token);
    }
    
})


module.exports = {
    path: '/',
    router
}
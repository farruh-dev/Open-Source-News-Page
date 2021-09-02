const router = require('express').Router();
const { createToken, checkToken } = require('../module/jwt');

async function AuthUserMiddleware(req, res, next){
    if(!req.cookies.token){
        res.redirect('/')
        return;
    }

    const isTrust = checkToken(req.cookies.token)

    if(isTrust){
        req.user = isTrust
        next()
    }else{
        res.redirect('/')
        return;
    }
}

router.get('/', AuthUserMiddleware, (req, res) =>{
    res.render('news', {
        title: 'News'
    })
})

module.exports = {
    path: '/news',
    router
}
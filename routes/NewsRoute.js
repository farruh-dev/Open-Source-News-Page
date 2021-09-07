const router = require('express').Router();
const { createToken, checkToken } = require('../module/jwt');


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

router.get('/', AuthUserMiddleware, async (req, res) =>{
    const newsData = await req.db.posts.find().toArray()

    const allNews = newsData.reverse()

    res.render('news', {
        title: 'News',
        allNews
    })
})

router.post('/', async (req, res) =>{
    const {keyword} = req.body

    if(!keyword){
        res.redirect('/')
    }

    const newsDataTags = await req.db.posts.find({ tags: keyword }).toArray()
    // const newsDataNames =   await req.db.posts.find().toArray()
   
    // let array = []
    
    // for(let i of newsDataNames){
        
    //     if( i.heading.toLowerCase().includes( keyword.toLowerCase() ) ){
    //         array.push(i)
    //     }
        
    // }
    
    // // console.log(newsDataTags, '/////////////////////', array);

    // for(let i of array){
    //     for(let e of newsDataTags){
    //         if(i.ID != e.ID){
    //             newsDataTags.push(i)
    //         }
    //     }
    // }
    

    res.render('mainsearchRes',{
        title: 'Izlash',
        newsDataTags
    })
})


router.get('/batafsil/:id', async (req, res) =>{

    try {
        const moreInfo = await req.db.posts.findOne(
            {ID: req.params.id}
        )
        if (!moreInfo) {
            
            res.render('more', {
                title: 'Not Found'
            })
            return
        }
        
        const links = moreInfo.links
        
        res.render('more', {title: "Batafsil", moreInfo, links})

    } catch (error) {
        if (error) throw error
    }

})

module.exports = {
    path: '/news',
    router
}
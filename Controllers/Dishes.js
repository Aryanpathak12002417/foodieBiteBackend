const router=require('express').Router()
const Dishes=require('../Model/Dishes')
const Menu=require('../Model/Menu')
const {Op} =require('sequelize')
const AdminAuth=require('../Utiles/AdminAuth')
const fs=require('fs')
const imageUpload=require('../Utiles/ImageKit.js')



router.get('/show-dishes',(req,res)=>{

    Dishes.findAll().then((result)=>{
        res.status(200).json({"data":result})
    }).catch((err)=>{
        console.log(err)
        res.status(400).json({"msg":"Please try again later"})
    })
})


router.get('/search-dishes',(req,res)=>{

    const {dishName}=req.query;
    Dishes.findAll({where:{name:{[Op.like]:`%${dishName}%`}},attributes:['name','dish_id']}).then((result)=>{
        res.status(200).json({"data":result})
    }).catch((err)=>{
        console.log(err)
        res.status(500).json({"msg":"Please try again later"})
    })

})

router.post('/add-dishes',AdminAuth,(req,res)=>{

    const {name,description}=req.body
    const image=req.files.imageUrl;
    const imageData=fs.readFileSync(image.tempFilePath,'base64')
    imageUpload.upload({

        file:imageData,
        fileName:image.name

    }).then((data=>{

        const fileid=data.fileId
        const url=data.url;
        const result={
            fileid,
            url
        }
        return {fileid,url}

    })).then((data)=>{

        return Dishes.create({
            name,
            imageUrl:data.url,
            imageID:data.fileid,
            description
            
        })

    }).then((result)=>{

        res.status(200).json({"msg":"Dishes Successfully added"})

    }).catch((err)=>{

        console.log(err);
        res.status(400).json({"msg":"Cannot create dish.Kindly try again"})

    })

})


router.get('/show-menu',(req,res)=>{

    const {date,time}=req.query;
    Menu.findAll({where:{date:date,time:time},include:[{
        model:Dishes,
        required:true
    }]}).then((result)=>{
        res.status(200).json({"result":result})
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({"msg":"Please try again."})
    })
    

})


router.post('/add-menu',AdminAuth,(req,res)=>{

    const {menus}=req.body;
    Menu.bulkCreate(menus).then((result)=>{
        res.status(200).json({"msg":"Menu Successfully updated"})
    }).catch((err)=>{
        console.log(err)
        res.status(400).json({"msg":"Error Occurred! Please try again later"})
    })


})



module.exports=router
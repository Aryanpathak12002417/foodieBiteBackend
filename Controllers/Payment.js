const express=require('express')
const app=express()
const router=express.Router()
const stripe=require('stripe')(process.env.STRIPE_PAYMENT_SECRET_KEY)
const uuid=require('uuid')
const Auth=require('../Utiles/Auth.js')


//Stripe Enabled payment route.
// router.post('/plains',Auth,(req,res)=>{

//     const {product,token}=req.body
//     console.log("PORDUCT ",product)
//     console.log("PRICE ",product.price)
//     const idempontencyKey=uuid()
//     console.log("IDEMPONTENCY ",idempontencyKey)
//     if(!product || !product.price){

//         res.status(400).json({"msg":"Please select a product before entering "})
//         return

//     }

//     return stripe.customers.create({

//         email:token.email,
//         source:token.user_id

//     }).then((customers)=>{

//         stripe.charges.create({

//             amount:product.price*100,
//             currency:'inr',
//             customer:customers.id,
//             receipt_email:token.email,
//             description:`User have purchased plan of ${product.name}`

//         },
//         {
//             idempontencyKey
//         })
//     })
//     .then((result=>{
//         console.log(result)
//         res.status(200).json({"msg":"Order placed successfully"})
//     }))
//     .catch((err)=>{

//         console.log(err);
//         res.status(400).json({"msg":"Could not place order. Please refer other payment option or try again"})

//     })


// })


router.post('/plains',(req,res)=>{

    const {plain}=req.body;
    

})



module.exports=router
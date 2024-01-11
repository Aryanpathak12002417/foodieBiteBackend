const express=require('express')
require('dotenv').config()
const app=express()
const user=require('./Controllers/User.js')
const Dishes=require('./Controllers/Dishes.js')
const Payment=require('./Controllers/Payment.js')
const fileUpload=require('express-fileupload')
const db=require('./Utiles/database.js')
const cookieParser=require('cookie-parser')
const cros=require('cors')


//Middlewares
app.use(cros())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(fileUpload({
    limits:{ fileSize: 50 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


//Routes
app.use('/user',user)
app.use('/dishes',Dishes)
app.use('/payment',Payment)


app.listen(process.env.PORT,()=>{

        //This sync function check if any model that is not present in the database created table at the very beginnig
        db.sync().then(()=>{
            console.log(`Server is running at port ${process.env.PORT}`)
        }).catch(err=>{
            console.log('Failed to establish db connection')
        })
    
})
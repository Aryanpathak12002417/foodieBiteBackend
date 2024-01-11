const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const auth=require('../Utiles/Auth.js')
const User = require('../Model/User');
const userInformation=require('../Model/UserInformation.js')
const userStatus=require('../Model/UserStatus.js')
const Otp=require('../Model/Otp.js')
const generateOtp=require('../Utiles/generateOtp.js');
const EmailServices=require('../Utiles/Emai.js');
const Authotp=require('../Utiles/AuthOtp.js')




router.post('/adminSignup',async (req,res)=>{

    const {firstName,lastName,email,password,phoneNumber}=req.body;
    const cpassword=await bcrypt.hash(password,10)
    console.log("The crypted password is: ",cpassword)
    

    User.create({
        
        first_name:firstName,
        last_name:lastName,
        email:email,
        phone_number:phoneNumber,
        password:cpassword

    }).then((data)=>{
        

        console.log('User data store successfully')
        console.log(data)
        const user_id=data.dataValues.user_id
        console.log("User id :",user_id)
        try{

            const token=jwt.sign({admin_id:user_id},process.env.SECRET_KEY)
            res.cookie('Token',token);
            res.status(200).json({"msg":"User created successfully"})

        }
        catch(err){
            console.log(err)
            User.destroy({
                where:{
                    user_id
                }
            }).then((err)=>{
                console.log("User state deleted")
                res.status(400).json({"msg":"There is error in the system"})
            }).catch(err=>{
                console.log('Need to manually delete user with user id: ',user_id);
            })
        }

    }).catch((err)=>{

        console.log(err.original)
        if(err.original && err.original.sqlMessage && err.original.sqlMessage.includes('Duplicate entry')){
            err.fields.phone_number?
            res.status(400).json({msg:"Phone Number already exist"})
            :res.status(400).json({msg:"Email id already exist"})
        }
        else{
            res.status(400).json({"msg":"Pease try again later"});
        }

    })


})


router.post('/signup',async (req,res)=>{

    const {firstName,lastName,email,password,phoneNumber}=req.body;
    const cpassword=await bcrypt.hash(password,10)
    console.log("The crypted password is: ",cpassword)
    

    User.create({
        
        first_name:firstName,
        last_name:lastName,
        email:email,
        phone_number:phoneNumber,
        password:cpassword

    }).then((data)=>{
        

        console.log('User data store successfully')
        console.log(data)
        const user_id=data.dataValues.user_id
        console.log("User id :",user_id)
        try{

            const token=jwt.sign({user_id},process.env.SECRET_KEY)
            res.cookie('Token',token);
            res.status(200).json({"msg":"User created successfully"})

        }
        catch(err){
            console.log(err)
            User.destroy({
                where:{
                    user_id
                }
            }).then((err)=>{
                console.log("User state deleted")
                res.status(400).json({"msg":"There is error in the system"})
            }).catch(err=>{
                console.log('Need to manually delete user with user id: ',user_id);
            })
        }

    }).catch((err)=>{

        console.log(err.original)
        if(err.original && err.original.sqlMessage && err.original.sqlMessage.includes('Duplicate entry')){
            
            err.fields.phone_number?
            res.status(400).json({msg:"Phone Number already exist"})
            :res.status(400).json({msg:"Email id already exist"})
        }
        else{
            res.status(400).json({"msg":"Pease try again later"});
        }

    })

})

router.post('/signin',async (req,res)=>{

    const {userDetail,password}=req.body
    console.log(userDetail,password)
    try{

        User.findAll({where:{email:userDetail}}).then((data)=>{
            // console.log(data.dataValues.password)
            const cpassword=data[0].dataValues.password;
            bcrypt.compare(password,cpassword,(err,result)=>{

                if(err){
                    res.status(400).json({"msg":"Please enter correct Password"})
                }
                else{
                    try{
                        const token=jwt.sign({user_id:data[0].dataValues.user_id},process.env.SECRET_KEY);
                        res.cookie('Token',token);
                        res.status(200).json({"msg":"User logged in successfully"})
                    }catch(err){
                        res.status(400).json({"msg":"Please try again later"})
                    }
                }
            })
            
        }).catch((err)=>{
            res.status(400).json({"msg":"Please try again later"})
        })

    }catch(err){
        res.send("error")
    }

})

router.get('/logout',(req,res)=>{
    
    res.cookie('Token','')
    res.status(200).json({"msg":"Successfully logout"})

})


router.get('/user-details',auth,(req,res)=>{
    
    const user_id=req.user_id;
    User.findAll({where:{user_id},attributes: { exclude: ['createdAt', 'updatedAt','user_id','password','status'] }}).then((data)=>{
        res.status(200).json(data[0].dataValues)
    }).catch((err)=>{
        res.status(400).json({msg:"Account not found"})
    })


})



router.post('/update-details',auth,async (req,res)=>{

    try{
        const user_id=req.user_id;
        const {firstName,lastName,email,phoneNumber}=req.body;
        const user=await User.findByPk(user_id);
        console.log(user)
        if(!user){
            res.status(404).json({"msg":"Account not found"});
        }
        else{
    
            user.update({
                first_name:firstName,
                last_name:lastName,
                email:email,
                phone_number:phoneNumber
            })
            await user.save()
            res.status(200).json({"msg":"Successfully Updated your details"})
            
        }
    }catch(err){

        res.status(400).json({"msg":"Cannot update your details"});

    }

})


router.post('/send-otp',async(req,res)=>{

    const {email}=req.body
    if(!email){
        res.status(400).json({"msg":"Please provide an"})
    }
    try{

        const oneTimePassword=generateOtp()
        await Otp.upsert({loginid:email,otp:oneTimePassword})
        await EmailServices.sendOtp(email,oneTimePassword)
        const otpToken=jwt.sign({data:"otp-verifed"},process.env.SECRET_KEY,{
            expiresIn:'5m'
        })
        res.cookie('OtpToken',otpToken)
        res.status(200).json({"msg":"Otp send Successfully"})

    }
    catch(err){
        console.log(err);
        res.status(400).send("Not found")
    }

})


router.post('/verify-otp',Authotp,async(req,res)=>{

    try{

        const {requestedOtp,email}=req.body
        const reqData= (await Otp.findAll({where:{loginid:email},attributes: ['otp']}))
        if(reqData.length<1){
            console.log("Please send otp before verfidying it")
            res.cookie('OtpToken',"");
            res.status(200).json({"msg":"Please send otp before verfidying it"})
            return
        }
        actualOtp=reqData[0].dataValues.otp
        console.log(actualOtp==requestedOtp)
        if(actualOtp==requestedOtp){
            await Otp.destroy({where:{loginid:email}})
            res.cookie('OtpToken',"");
            res.status(200).json({"msg":"Successfully verfied"})
        }
        else{
            res.status(400).json({"msg":"Otp not match"})
        }

    }catch(Err){
        console.log(Err)
        res.status(400).json({"msg":"Some Error occured please try again"})
    }

})

router.post('/update-password',auth,(req,res)=>{

    const {currentPassword,newPassword}=req.body;
    User.findAll({where:{user_id:req.user_id},attributes:['password']}).then((data)=>{
        if(data.length<0){
            res.status(400).json({"msg":"Please login again"});
            return;
        }
        const cpassword=data[0].dataValues.password;
        bcrypt.compare(currentPassword,cpassword,async (err,data)=>{
            if(err){
                res.status(400).json({"msg":"Please enter current password"})
                return;
            }
            const newCpassword=await bcrypt.hash(newPassword,10);
            const user= await User.findAll({where:{user_id:req.user_id}})
            user.password=newCpassword;
            user.save()
            res.status(200).json({"msg":"Successfully updated the password"})
        })
    })

    
})


router.post('/user-Information',auth,(req,res)=>{

    const {address,city,state,pincode}=req.body
    let {preffBrkfastHrs,preffLunchHrs,preffDinnerHrs}=req.body
    if(!address || !city || !state || !pincode){
        res.status(400).json({"msg":"Please fill information in all the mandetory field"})
        return;
    }

    if(!preffBrkfastHrs){
        preffBrkfastHrs='08:00:00'
    }
    if(!preffDinnerHrs){
        preffDinnerHrs='20:00:00'
    }
    if(!preffLunchHrs){
        preffLunchHrs='13:00:00'
    }

    userInformation.create({
        user_id:req.user_id,
        address,
        city,
        state,
        pincode,
        preffBrkfastHrs,
        preffLunchHrs,
        preffDinnerHrs
    }).then((data)=>{
        console.log(data)
        res.status(200).json({"msg":"The user information is stored successfully"})
    }).catch((err)=>{
        console.log(err)
        res.status(500).json({"msg":"INTERNAL SERVER ERROR"})
    })


})


router.get('/get-user-information',auth,(req,res)=>{

    userInformation.findAll({where:{user_id:req.user_id},attributes:{
        exclude:['user_id','createdAt','updatedAt']
    }}).then((response)=>{
        console.log(response)
        res.status(200).json({data:response})
    }).catch((err)=>{
        console.log(err)
        res.status(400).json({"msg":"Error while getting user information"})
    })

})


router.post('/update-user-information',auth,(req,res)=>{

    const {address,city,state,pincode}=req.body
    let {preffBrkfastHrs,preffLunchHrs,preffDinnerHrs}=req.body
    if(!address || !city || !state || !pincode){
        res.status(400).json({"msg":"Please fill information in all the mandetory field"})
        return;
    }

    if(!preffBrkfastHrs){
        preffBrkfastHrs='08:00:00'
    }
    if(!preffDinnerHrs){
        preffDinnerHrs='20:00:00'
    }
    if(!preffLunchHrs){
        preffLunchHrs='13:00:00'
    }

    userInformation.update({user_id:req.user_id,address,city,state,pincode,preffBrkfastHrs,preffLunchHrs,preffDinnerHrs},{
        where:{
            user_id:req.user_id
        }
    }).then((data)=>{
        res.status(200).json({"msg":"User information is successfully updated"})
    }).catch((err)=>{
        console.log(err)
        res.status(400).json({"msg":"Please try again later"})
    })
})


//Put admin route
//Complete after completing userInformation route
//update the status table after successfull completion of the order
router.post('/orderConfirm',async (req,res)=>{

    const {email,user_id}=req.body;

    try{
        const user=await userInformation.findAll({where:{user_id},include:[{
            model:User,
            required:true
            }]
        })
        console.log(user)
        res.send(user)
    }
    catch(err){
        console.log(err)
        res.status(500).json({"msg":"Internal Server errors"})
    }

})




module.exports=router;
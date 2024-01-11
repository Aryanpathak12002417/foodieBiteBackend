const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>{
    const token=req.cookies.OtpToken;

    if(!token){

        res.status(400).json({"msg":"Unauthorized Token."})
        return;

    }
    try{
        
       jwt.verify(token,process.env.SECRET_KEY);
       next();

    }
    catch(err){

        res.status(400).json({"msg":"Unauthorized Token."})
        return;
        
    }
}
const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>{
    const token=req.cookies.Token;

    if(!token){

        res.status(400).json({"msg":"Please signin or signup with our system"})
        return;

    }
    try{
        
       const user=jwt.verify(token,process.env.SECRET_KEY);
       req.user_id=user.user_id
       next();

    }
    catch(err){

        res.status(400).json({"msg":"Unauthorized Token. Please sign in again"})
        return;
        
    }
}
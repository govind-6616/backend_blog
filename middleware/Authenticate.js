const jwt=require('jsonwebtoken');

const User=require('../models/userSchema');
const Authenticate=async (req,res,next)=>{
    try{
const token=req.headers['x-access-token'];
const verifyToken=jwt.verify(token,"secret123");
const rootUser=await User.findById({_id:verifyToken._id});
console.log(rootUser);
if(!rootUser){
    throw new Error('user not found');
    
}
req.rootUser=rootUser;

next();
    }
    catch(err){
        res.status(401).send("not authorise");
        console.log(err);
    }

}
module.exports=Authenticate;
// const createToken=async ()=>{
//    const token=await jwt.sign({unique_key:"254887455484"},"qwerftyuhbgekjuuyrbhfjiurnspoundgr",{
//        expiresIn:"5 seconds"
//    });

// console.log(token);
// const userVar=await jwt.verify(token,"qwerftyuhbgekjuuyrbhfjiurnspoundgr");
// console.log(userVar);
// }

// createToken();
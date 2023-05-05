const jwt = require('jsonwebtoken');
const JWT_SEC = "dadgfkgioifjefj";

const fetchuser=(req,res,next)=>{
    try {
    // getting the user from auth token and add id to req obj
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Invalid auth token"})
    }
    const data = jwt.verify(token,JWT_SEC);
    req.user = data.user;
    next();
    } catch (error) {
        res.status(401).send({error:"Some Internal error occured"})
    }
}

module.exports = fetchuser;
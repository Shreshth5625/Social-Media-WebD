const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    //GET TOKEN FROM HEADER
    const token = req.header('x-auth-token');   //header key that we want to send the token in
    
    //CHECK IF NO TOKEN
    if(!token){
        return res.status(401).json({message: 'No Token, Authorization denied.'})   //401 => not authorized
    }

    //VERIFY TOKEN (checking validity of token)
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret')); //bascially we need to decode the token

        //set req.user to the user inside the decoded token
        req.user = decoded.user;    
        next();
    }
    catch(err)
    {   
        res.status(401).json({message:'Token is not valid.'});
    }
}
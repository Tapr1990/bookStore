const jwt = require("jsonwebtoken");


function auth(req, res, next) {
    if(!req.header("Authorization")) {
        return res.status(401).send({"message":"Unauthorized"});
    }

    const token = req.header("Authorization").replace("Bearer", "").trim();

    //res.send(token);

    try {

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        req.userPayload = payload;

        next();
    }
    catch(err) {
        return res.status(400).send({"message":"invalid auth token"});
    }



}

module.exports = auth;
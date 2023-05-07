module.exports.isAuth = (req,res,next) => {
    if(req.isAuthenticated()) {
        next();
    } else{
        res.status(401).json({msg: "not authorized to view resource"})
    }
}

module.exports.isAdmin = (req,res,next) => {
    if(req.isAuthenticated && req.user.Admin === true){
        next();
    } else{
        res.status(401).json({msg: "Admin permissions required to access information"})
    }
}
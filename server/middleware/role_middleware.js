const jwt = require('jsonwebtoken');

module.exports = function(role) {
    if (req.method === "OPTION"){
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token){
            return resizeBy.status(401).json({message: "Не авторизован"})
        }
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        if (decoded.role !== role) {
            return res.status(403).json({message:"Нет доступа"})
        }
        req.user = decoded;
        next()
    } catch (error) {
        res.status(401).json({message: "Не авторизован"})
    }
}
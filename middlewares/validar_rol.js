const { response, request } = require("express");


const esAdmin = (req = request,res = response, next)=>{

    if(!req.user){
        return res.status(500).json({
            msg: 'Error de validacion de usuario'
        })
    }

    const {rol, nombre} = req.user;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no posee los permisos para realizar esta accion`
        })
    }

    next();
}

const tieneRol = (...roles) =>{

    return (req, res=response, next) =>{

        if(!req.user){
            return res.status(500).json({
                msg: 'Error de validacion de usuario'
            })
        }

        if(!roles.includes(req.user.rol)){
            return res.status(401).json({
                msg: `El servicio requiere uno de los siguientes roles: ${roles}`
            })
        }
        next();
    }
}

module.exports = {
    esAdmin,
    tieneRol
}
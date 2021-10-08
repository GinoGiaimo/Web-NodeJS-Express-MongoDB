const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req, res=response, next) =>{
    const token = req.header('x-token');
    console.log(token);

    if(!token){
        return res.status(401).json({
            msg:'No se encontro ningun token'
        })
    }

    try {
        //const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //console.log(payload);

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const u = await Usuario.findById(uid);
        
        if(!u){
            return res.status(401).json({
                msj:'Token no valido - Usuario no existente en BD '
            })
        }

        //Verificar el estado del usuario que se intenta loguear
        if(!u.estado){
            return res.status(401).json({
                msj:'Token no valido - Usuario estado:false '
            })
        }
        
        req.user = u;
        //req.uid = uid;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token invalido'
        })
    }
    
}

module.exports = {
    validarJWT
}
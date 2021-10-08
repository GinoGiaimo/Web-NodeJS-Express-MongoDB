const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const generarJWT = require("../helpers/jwt");


const loginController = async(req, res=response)=> {
    const {correo, password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - correo'
            })
        }

        if(usuario.estado != true){
            res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - estado:false'
            })
        }

        const validarPass = bcryptjs.compareSync(password, usuario.password);
        if(!validarPass){
            res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - password'
            })
        }

        const token = await generarJWT(usuario.id);

        console.log(token);

        res.json({
            msg: 'Login OK',
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Cominiquese con el administrador'
        })
    }
    
}

module.exports = {
    loginController
}
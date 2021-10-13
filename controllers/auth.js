const { response, request } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const generarJWT = require("../helpers/jwt");
const googleVerify = require("../helpers/google_verify");


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

const googleSignIn = async(req = request, res=response)=>{

    const {id_token} = req.body;

    try {
        //const googleUser = await googleVerify(id_token); 

        //googleUser correspondea un usuairo con nombre, correo e imagen

        const {nombre, correo, img} = await googleVerify(id_token); 

        let usuario = await Usuario.findOne({correo}); //Corroboro que no exista ya un usuairo con dicho correo

        if(!usuario){
            //Lo creo
            const data = {
                nombre,
                correo,
                password: '',
                img,
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        if(usuario.estado === false){
            return res.status(401).json({
                msg: 'Usuario bloqueado - estado:false'
            })
        }

        //Generamos un JWT
        const token = await generarJWT(usuario.id);

        console.log(googleUser);
        
        res.json({
            msg: 'Ok google SignIn',
            id_token,
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Google token no reconocido'
        })
    }
    
}

module.exports = {
    loginController,
    googleSignIn
}
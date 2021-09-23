const {response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async(req, res = response)=>{
    const {limite=5, desde=0} = req.query;


    //Recuperar los usuarios activos de forma paginada y la cantidad de los mismo
    // const usuarios = await Usuario.find({estado: true}).skip(Number(desde)).limit(Number(limite));
    // const totalUsuarios = await Usuario.countDocuments({estado:true});


    //Este codigo realiza lo mismo que las 2 lineas anteriores solo que utilizando un(1) unico await
    const [total, usuarios] = await Promise.all([   //Desestructuracion de arreglos
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado: true}).skip(Number(desde)).limit(Number(limite))
    ])

    //const cant = usuarios.length; solo contara la cantidad de usuarios con paginacion, si lim = 5 ... cant = 5
    
    res.json({
        msg: 'get API - controlador',
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response)=>{
    //const {google, ...resto} = req.body En resto se guardara todo menos el atributo google
    //const usuario = new Usuario(resto) Creamos un usaurio con todos los atributos menos el de google
    //const body = req.body; //hace referencia a la informacion que se manda en un post

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol}); //Creo una nueva instancia de Usuario


    //Verificar si el correo ya esta registrado
    // const existe = await Usuario.findOne({correo: correo});
    // if(existe){
    //     return res.status(400).json({
    //         msg: 'El correo ya esta registrado'
    //     })
    // }


    //Encriptacion
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);


    //Guardado en BD
    await usuario.save();
    res.json({
        msg: 'post API - controlador',
        usuario
    })
}

const usuariosPut = async(req, res = response)=>{
    const id = req.params.id; //accedo al id dado por parametros en la url
    //const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;


    //Validar contra BD
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'put API - controlador',
        id
    })
}

const usuariosDelete = async (req, res = response)=>{
    
    const {id} = req.params;

    //Borrado fisico
    //const usuario = await Usuario.findByIdAndDelete(id);


    //Borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    
    res.json({
        msg: 'delete API - controlador'
    })
}





module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}
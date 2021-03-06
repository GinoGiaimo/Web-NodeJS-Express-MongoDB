const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const Producto = require("../models/producto");
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');

const coleccionesPermitidas =[
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response)=>{
    if(isValidObjectId(termino)){
        const usuario = await Usuario.findById(termino);
        
        return res.json({
            results: (usuario ? [usuario] : [])
        });
    }else{

        const regex = RegExp(termino, 'i');

        const usuarios = await Usuario.find({
            $or: [{nombre:regex}, {correo:regex}],
            $and: [{estado:true}]
        });
        return res.json({
            results: usuarios
        })
    }
}

const buscarCategorias = async(termino = '', res = response)=>{
    if(isValidObjectId(termino)){
        const categoria = await Categoria.findById(termino);
        
        return res.json({
            results: (categoria ? [categoria] : [])
        });
    }else{

        const regex = RegExp(termino, 'i');

        const categorias = await Categoria.find({nombre:regex, estado:true});
        return res.json({
            results: categorias
        })
    }
}

const buscarProductos = async(termino = '', res = response)=>{
    if(isValidObjectId(termino)){
        const producto = await Producto.findById(termino);
        
        return res.json({
            results: (producto ? [producto] : [])
        });
    }else{

        const regex = RegExp(termino, 'i');

        const productos = await Producto.find({nombre:regex, estado:true});
        return res.json({
            results: productos
        })
    }
}

const buscar = (req, res=response) =>{
    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        
        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;

        case 'roles':

            break;

        default:
            res.status(500).json({
                msg: 'Falta esta busqueda'
            })
            
    }
}

module.exports = {
    buscar
}
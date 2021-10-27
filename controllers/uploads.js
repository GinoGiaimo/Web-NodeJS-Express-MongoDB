const path = require('path');
const fs = require('fs');
const { response } = require("express");
const subirArchivo = require("../helpers/subir-archivo");
const producto = require("../models/producto");
const usuario = require("../models/usuario");
const { dirname } = require('path');



const cargarArchivo = async(req, res=response) => {

    // if (!req.files || Object.keys(req.files).length === 0) {
    //     res.status(400).json('No se encontraron archivos.');
    //     return;
    // }

    // if (!req.files.archivo) {
    //     res.status(400).json('No se encontraron archivos.');
    //     return;
    // }

    try {
        const nombre =await subirArchivo(req.files);
        res.json({
            nombre
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
    
}

const actualizarImagen = async(req, res=response) =>{
    // if (!req.files || Object.keys(req.files).length === 0) {
    //     res.status(400).json('No se encontraron archivos.');
    //     return;
    // }

    // if (!req.files.archivo) {
    //     res.status(400).json('No se encontraron archivos.');
    //     return;
    // }
    
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe usuario con id: ${id}`
                })
            }
            break;
        
        case 'productos':
            modelo = await producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe producto con id: ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Falta validar esto'
            })
    }

    //Verificar la existencia de imagenes
    if(modelo.img){
        const pathImg = path.join(__dirname, '../uploads/', coleccion, modelo.img)

        if(fs.existsSync(pathImg)){
            fs.unlinkSync(pathImg)
        }
    }

    const nombre =await subirArchivo(req.files, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async(req, res=response)=>{
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe usuario con id: ${id}`
                })
            }
            break;
        
        case 'productos':
            modelo = await producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe producto con id: ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Falta validar esto'
            })
    }

    //Verificar la existencia de imagenes
    if(modelo.img){
        const pathImg = path.join(__dirname, '../uploads/', coleccion, modelo.img)

        if(fs.existsSync(pathImg)){
            return res.sendFile(pathImg)
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(pathImagen);

     
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}
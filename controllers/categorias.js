const { response, request } = require("express");
const Categoria = require("../models/categoria");

const obtenerCategorias = async(req=request, res=response)=>{
    const {limite=5, desde=0} = req.query;

    //const categorias = await Categoria.find({estado:true}).skip(Number(desde)).limit(Number(limite));
    //const totalCategorias = await Categoria.countDocuments({estado:true});

    const [categorias, totalCategorias] = await Promise.all([
        Categoria.find({estado:true}).populate('usuario').skip(Number(desde)).limit(Number(limite)),
        Categoria.countDocuments({estado:true})
    ])

    res.json({
        categorias,
        totalCategorias
    })
}

const obtenerCategoria = async (req=request, res=response)=>{
    const catId = req.params.id

    const categoria = await Categoria.findById(catId).populate('usuario', ['nombre', 'estado']);

    if(!categoria || categoria.estado === false){
        res.status(400).json({
            msg: 'No fue posible encontrar la categoria'
        })
    }

    res.json({
        categoria
    })
}

const crearCategoria = async(req, res=response)=>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaBd = await Categoria.findOne({nombre});

    if(categoriaBd){
        res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.user._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json(categoria)
}

const borrarCategoria = async(req=request, res=response) =>{
    const {id} = req.params;

    const usuarioAutenticado = req.user;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false, usuario:usuarioAutenticado});

    res.json({
        categoria
    })
}

const actualizarCategoria = async(req=request, res=response) =>{
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();

    

    const existeNombre = await Categoria.findOne({nombre});

    if(existeNombre && existeNombre.estado === true){
        res.status(400).json({
            msg: `Error, La categoria ${nombre} ya se encuentra registrada`
        })
    }

    const usuarioAutenticado = req.user._id;

    const categoria = await Categoria.findByIdAndUpdate(id, {nombre, usuario:usuarioAutenticado});

    res.json({
        categoria
    })
}



module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    borrarCategoria,
    actualizarCategoria
}
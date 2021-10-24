const { response, request } = require("express");
const Producto = require('../models/producto');

const obtenerProductos = async(req=request, res=response) =>{
    const {limite=5, desde=0} = req.query;

    const [productos, totalProductos] = await Promise.all([
        Producto.find({estado:true}).populate('usuario', ['nombre', 'estado']).populate('categoria', 'nombre').skip(Number(desde)).limit(Number(limite)),
        Producto.countDocuments({estado:true})
    ]);

    res.json({
        productos,
        totalProductos
    });
}

const obtenerProducto = async(req=request, res=response) =>{
    const productoId = req.params.id;

    const producto = await Producto.findById(productoId).populate('usuario', ['nombre', 'estado']).populate('categoria', 'nombre');

    res.json({
        producto
    })
}

const crearProducto = async(req, res=response)=>{
    const {precio, categoria, descripcion, disponible} = req.body;
    const nombre = req.body.nombre.toUpperCase();

    //Puedo corroborar si existe el producto
    const productoBD = await Producto.findOne({nombre});

    if(productoBD){
        return res.status(400).json({
            msg: `El producto ${nombre} ya se encuentra registrado`
        })
    }

    const usuario= req.user._id;
    const producto = new Producto({nombre, usuario, precio, categoria, descripcion, disponible});

    await producto.save();

    res.status(201).json(producto);
}

const editarProducto = async(req=request, res=response) =>{
    const {id} = req.params;
    const {precio, categoria, descripcion, disponible} = req.body;
    const nombre = req.body.nombre.toUpperCase();

    const usuarioAutenticado = req.user;

    const producto = await Producto.findByIdAndUpdate(id, {nombre, usuarioAutenticado,precio, categoria, descripcion, disponible});

    res.json({
        producto
    })
}

const eliminarProducto = async(req, res=response) =>{
    const {id} = req.params;

    const usuarioAutenticado = req.user;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false, usuario:usuarioAutenticado});

    res.json({
        producto
    })
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    eliminarProducto,
    editarProducto
}
const {response} = require('express');

const usuariosGet = (req, res = response)=>{
    const query = req.query;

    res.json({
        msg: 'get API - controlador'
    })
}

const usuariosPost = (req, res = response)=>{
    const body = req.body; //hace referencia a la informacion que se manda en un post

    res.json({
        msg: 'post API - controlador',
        body
    })
}

const usuariosPut = (req, res = response)=>{
    const id = req.params.id; //accedo al id dado por parametros en la url
    //const {id} = req.params;

    res.json({
        msg: 'put API - controlador',
        id
    })
}

const usuariosDelete = (req, res = response)=>{
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
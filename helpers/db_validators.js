const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async(rol = '') => {
    const existeRole = await Role.findOne({rol});
    if(!existeRole){
        throw new Error(`El rol ${rol} no es valido`)
    }
}

const existeEmail = async(correo='') =>{
    const exist = await Usuario.findOne({correo: correo});
    if(exist){
        throw new Error(`El correo ${correo} ya se encuentra registrado`);
    }
}

const existeUsuario = async(id='') => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error('No se encontro el usuario especificado');
    }
}

module.exports = {
    esRolValido,
    existeEmail,
    existeUsuario
}
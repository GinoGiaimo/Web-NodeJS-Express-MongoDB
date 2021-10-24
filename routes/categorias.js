const {Router} = require('express');
const { check } = require('express-validator');
const {crearCategoria, obtenerCategorias, obtenerCategoria, borrarCategoria, actualizarCategoria} = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db_validators');
const { validarCampos } = require('../middlewares/validar_campos');
//const { validarCampos } = require('../middlewares/validar_campos');
const { validarJWT } = require('../middlewares/validar_jwt');

const router = Router();

// api/categorias

router.get('/', obtenerCategorias);

router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria );

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
],crearCategoria);

router.put('/:id',[
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
],actualizarCategoria ); 

router.delete('/:id',[
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria );

module.exports = router;
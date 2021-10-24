const {Router} = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, eliminarProducto, editarProducto } = require('../controllers/productos');
const { existeCategoria, existeProducto } = require('../helpers/db_validators');
const { validarCampos } = require('../middlewares/validar_campos');
const { validarJWT } = require('../middlewares/validar_jwt');

const router = Router();

//api Productos

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'Es necesario un id').notEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProducto);

router.post('/', [
    validarJWT,
    check('categoria', 'Se requiere una categoria').notEmpty(),
    check('categoria', 'Categoria invalida').isMongoId(),
    validarCampos
],crearProducto);

router.put('/:id', [
    validarJWT,
    check('id').custom(existeProducto),
    validarCampos
], editarProducto);

router.delete('/:id', [
    validarJWT,
    check('id').custom(existeProducto),
    validarCampos
], eliminarProducto );

module.exports = router;
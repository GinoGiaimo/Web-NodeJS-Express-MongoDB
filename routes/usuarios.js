const {Router} = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');
const { esRolValido, existeEmail, existeUsuario } = require('../helpers/db_validators');
const { validarCampos } = require('../middlewares/validar_campos');
const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuario),
    check('rol').custom(esRolValido),
    validarCampos
],usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password ingresado debe contener al menos 8 caracteres').isLength({min:8}),
    //check('correo', 'El valor ingresado no corresponde a un correo').isEmail(),
    check('correo').custom(existeEmail),
    //check('correo', 'No corresponde a un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
] ,usuariosPost);

router.delete('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuario),
    validarCampos
],usuariosDelete);

module.exports = router;
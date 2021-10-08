const {Router} = require('express');
const { check } = require('express-validator');
const { loginController } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar_campos');

const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    validarCampos
], loginController )

module.exports = router;
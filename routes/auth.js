const {Router} = require('express');
const { check } = require('express-validator');
const { loginController, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar_campos');

const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    validarCampos
], loginController );

router.post('/google',[
    check('id_token', 'El id_token es necesario').notEmpty(),
    validarCampos
], googleSignIn )

module.exports = router;
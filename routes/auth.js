/*
    Rutas de usuario / Auth
    host + /api/auth
*/
const { Router } = require('express');
const router = Router();

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validators');
const { validateJWT } = require('../middlewares/jwt-validators');


router.post(
    '/new',
    [//middlewares
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validateFields
    ] , 
    crearUsuario 
);

router.post('/',
    [//middlewares
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validateFields
    ] ,
    loginUsuario 
);

router.get('/renew', validateJWT , revalidarToken );


module.exports = router;
 
 

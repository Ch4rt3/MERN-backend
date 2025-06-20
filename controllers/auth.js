const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un Usuario existe con ese correo',
            })
        }

        user = new User( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
    
        await user.save()
        
        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const loginUsuario = async(req, res = response) => {
 

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email',
            })
        }
        //Confirmar los passwords
        const isValidPassword = bcrypt.compareSync( password, user.password );

        if ( !isValidPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        };
        
        // Generar JWT
        const token = await generarJWT( user.id, user.name );

        return res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const revalidarToken = async(req, res = response) => {

    const { uid, name } = req.uid;
    
    //Generar un nuevo JWT y retornarlo

    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
/*
    Rutas de events / Events
    host + /api/event
*/

const { Router } = require('express');
const { check } = require('express-validator');

// const { isDate } = require('../helpers/isDate');
const { validateJWT } = require("../middlewares/jwt-validators");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");
const { validateFields } = require('../middlewares/field-validators');
const { isDate } = require('../helpers/isDate');

const router = Router();

//Todas tienen q pasar por la validacion de JWT
router.use( validateJWT );
// Obtener eventos
router.get('/', getEvents );

// Crear evento
router.post(
    '/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalizacion es obligatoria').custom( isDate ),
        validateFields
    ],
    createEvent 
);

// Actualizar evento
router.put('/:id', updateEvent );

// Borrar evento
router.delete('/:id', deleteEvent );

module.exports = router
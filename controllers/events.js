const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async( req, res = response ) => {
    
    const events = await Event.find().
                                populate('user','name');

    return res.status(200).json({
        ok: true,
        events
    });

}
const createEvent = async( req, res = response ) => {

    const event = new Event( req.body );
    try {
        
        event.user = req.uid;

        const savedEvent = await event.save();

        return res.json({
            ok: true,
            event: savedEvent
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador',
        })
    }


}
const updateEvent = async( req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const event = await Event.findById( eventId );

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id',
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento',
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        return res.json({
            ok: true,
            event: updatedEvent
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        })
    }
}
const deleteEvent = async( req, res = response ) => {
    
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const event = await Event.findById( eventId );

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id',
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento',
            })
        }

        await Event.findByIdAndDelete( eventId );

        return res.json({
            ok: true,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        })
    }

}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}
// {
//     ok: true,
//     msg: 'Obtener eventos',
// }
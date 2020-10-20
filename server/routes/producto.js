const express = require('express');
const { findLastIndex } = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');



//=====================
//Obtener productos
//====================
app.get('/producto', verificaToken, (req, res) => {

    let condicion = {
        disponible: true
    }

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find(condicion)
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });

        });
    //trae todos los productos
    //populate: usuario, categoria
    //paginado
});



//==========================
//Obtener un producto por ID
//===========================
app.get('/producto/:id', (req, res) => {
    //populate: usuario, categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});


//=======================
//Buscar productos
//=======================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});

//=======================
//Crear un nuevo producto
//=======================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(201).json({
                ok: true,
                producto: productoDB
            });
        })
        //grabar el usuario
        //grabar una categoria del listado
});


//=======================
//Actualizar un producto
//=======================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });
    //grabar el usuario
    //grabar una categoria del listado
});


//=======================
//Borrar un producto
//=======================
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }


    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'Producto borrado'
        });

    });

    //No borrar solo cambiar estado
});




module.exports = app;
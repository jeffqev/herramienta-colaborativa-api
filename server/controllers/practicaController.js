const { validationResult } = require('express-validator')
const Practica = require('../models/Practica')
const {
  practicaCoordinador,
  asignaturasCoordinador,
} = require('../utils/coordinador')

// crearPractica ingresa una practica en la base de datos
exports.crearPractica = async (req, res) => {
  // Validar errores de express-validator
  const errs = validationResult(req)
  if (!errs.isEmpty()) {
    res.status(400).json({ errores: errs.array() })
    return
  }

  try {
    const { plantilla } = req.body

    // Guardar la materia a la que pertenece la plantilla
    const asignatura = await practicaCoordinador(plantilla)

    if (!asignatura) {
      res.status(401).json({
        msg: 'Error con la plantilla ingresada',
      })
      return
    }

    // Revisar si es coordinador de la materia
    const esCoordinador = await asignaturasCoordinador(
      req.logueado.id,
      asignatura.toString()
    )

    if (!esCoordinador) {
      res.status(401).json({
        msg:
          'Permisos insuficientes para realizar la accion no es coordinador de la asignatura',
      })
      return
    }

    // crear el modelo con los datos del Request body
    const practicaModel = new Practica(req.body)

    // Guardar en la base de datos
    await practicaModel.save((err, room) => {
      if (err) {
        res.status(400).send({ msg: 'Error al insertar en la base de datos' })
        return
      }
      res.status(201).json({ msg: 'Practica ingresada con exito', id: room.id })
    })
  } catch (error) {
    res.status(500).json({ msg: 'hubo un error en el servidor' })
  }
}

// buscarPracticas Busca todas las practicas en la base de datos
exports.buscarPracticas = async (req, res) => {
  try {
    // buscar en la db
    const practicas = await Practica.find()
      .populate({ path: 'plantilla' })
      .populate({ path: 'ejercicios' })
      .populate({ path: 'periodo', select: 'periodo' })
      .exec()

    // si no hay datos retornar 404 not found
    if (!practicas) {
      res.status(404).json({ msg: 'No se encontraron practicas' })
      return
    }

    // caso contrario retornar la lista
    res.status(200).json({
      msg: 'Busqueda realizada con exito',
      data: practicas,
    })
  } catch (error) {
    res.status(500).json({ msg: 'hubo un error en el servidor' })
  }
}

// modificarPractica modifica una practica en la db buscandola por id
exports.modificarPractica = async (req, res) => {
  try {
    // Revisar si existe por el id enviado
    let practicaEncontrada = await Practica.findById(req.params.id)
    if (!practicaEncontrada) {
      res.status(404).json({ msg: 'Practica ha modificar no encontrada' })
      return
    }

    // Guardar la materia a la que pertenece la plantilla
    const asignatura = await practicaCoordinador(
      practicaEncontrada.plantilla.toString()
    )

    if (!asignatura) {
      res.status(401).json({
        msg: 'Error con la plantilla ingresada',
      })
      return
    }

    // Revisar si es coordinador de la materia
    const esCoordinador = await asignaturasCoordinador(
      req.logueado.id,
      asignatura.toString()
    )

    if (!esCoordinador) {
      res.status(401).json({
        msg:
          'Permisos insuficientes para realizar la accion no es coordinador de la asignatura',
      })
      return
    }

    // Modificar en la db
    practicaEncontrada = await Practica.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    )
    res.status(200).json({
      msg: 'practica modificada con exito',
      data: practicaEncontrada,
    })
  } catch (error) {
    res.status(500).json({ msg: 'hubo un error en el servidor' })
  }
}

// eliminarPractica Elimina una practica por el id
exports.eliminarPractica = async (req, res) => {
  try {
    // Revisar si existe por el id enviado
    const practicaEncontrada = await Practica.findById(req.params.id)
    if (!practicaEncontrada) {
      res.status(404).json({ msg: 'Practica a eliminar no encontrada' })
      return
    }

    // Guardar la materia a la que pertenece la plantilla
    const asignatura = await practicaCoordinador(
      practicaEncontrada.plantilla.toString()
    )

    if (!asignatura) {
      res.status(401).json({
        msg: 'Error con la plantilla ingresada',
      })
      return
    }

    // Revisar si es coordinador de la materia
    const esCoordinador = await asignaturasCoordinador(
      req.logueado.id,
      asignatura.toString()
    )

    if (!esCoordinador) {
      res.status(401).json({
        msg:
          'Permisos insuficientes para realizar la accion no es coordinador de la asignatura',
      })
      return
    }

    // Eliminar en la db
    await Practica.findOneAndRemove({ _id: req.params.id })
    res.status(200).json({ msg: 'Practica eliminada con exito' })
  } catch (error) {
    res.status(500).json({ msg: 'hubo un error en el servidor' })
  }
}

// buscarPracticaAsignatura Busca todas las practicas en la base de datos de una asignatura
exports.buscarPracticaAsignatura = async (req, res) => {
  try {
    // buscar en la db
    const practicas = await Practica.find({ asignatura: req.params.id })
      .populate({ path: 'plantilla' })
      .populate({ path: 'ejercicios' })
      .exec()

    // si no hay datos retornar 404 not found
    if (!practicas) {
      res.status(404).json({ msg: 'No se encontraron practicas' })
      return
    }

    // caso contrario retornar la lista
    res.status(200).json({
      msg: 'Busqueda realizada con exito',
      data: practicas,
    })
  } catch (error) {
    res.status(500).json({ msg: 'hubo un error en el servidor' })
  }
}

// buscarPracticas Busca una practica en la base de datos por id
exports.buscarPracticaID = async (req, res) => {
  try {
    // buscar en la db
    const practicas = await Practica.findById(req.params.id)
      .populate({ path: 'plantilla' })
      .populate({ path: 'ejercicios' })
      .exec()

    // si no hay datos retornar 404 not found
    if (!practicas) {
      res.status(404).json({ msg: 'No se encontraron practicas' })
      return
    }

    // caso contrario retornar la lista
    res.status(200).json({
      msg: 'Busqueda realizada con exito',
      data: practicas,
    })
  } catch (error) {
    res.status(500).json({ msg: 'hubo un error en el servidor' })
  }
}

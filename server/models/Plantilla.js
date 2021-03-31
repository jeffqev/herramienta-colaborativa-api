const mongoose = require('mongoose')

const { Schema, model } = mongoose

const PlantillaSchema = new Schema(
  {
    codigo: {
      type: String,
      trim: true,
      lowercase: true,
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    formato: {
      type: String,
      trim: true,
      lowercase: true,
    },
    requisitos: {
      type: [String],
      trim: true,
    },
    instrucciones: {
      type: [String],
      trim: true,
    },
    resultados: {
      type: [String],
      trim: true,
    },
    objetivos: {
      type: [String],
      trim: true,
    },
    temas: {
      type: Schema.Types.ObjectId,
      ref: 'Tema',
    },
    coordinador: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    asignatura: {
      type: Schema.Types.ObjectId,
      ref: 'Asignatura',
    },
  },
  {
    versionKey: false,
  }
)

module.exports = model('Plantilla', PlantillaSchema)
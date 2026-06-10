import mongoose from 'mongoose'

const timeLineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title required!'],
  },
  organisation: {
    type: String,
    required: [true, 'Organisation/Company name required'],
  },
  description: {
    type: String,
    required: [true, 'Description required!'],
  },
  timeline: {
    from: {
      type: String,
      required: [true, 'Timeline starting date is required!'],
    },
    to: String,
  },
})

export const Timeline = mongoose.model('Timeline', timeLineSchema)

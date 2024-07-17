import mongoose from 'mongoose'

const dbConnection = () => {
    mongoose.connect(`${process.env.MONGO}`)
    .then(() => console.log('Connected to DB!'))
    .catch((error) => console.log(`error occured while connecting to DB: ${error}`))
}

export default dbConnection
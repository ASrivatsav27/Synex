import mongoose from 'mongoose'

const connectDb= async () => {
    await mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
    console.log("Database Connected")
    })
}

export default connectDb
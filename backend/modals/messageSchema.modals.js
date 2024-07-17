import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderName:{
        type: String,
        minLength:[2, 'Name must contain atleast 2 characters!'],
        required: true
    },
    subject:{
        type: String,
        minLength:[2, 'Subject must contain atleast 2 characters!'],
        required: true
    },
    message:{
        type: String,
        minLength:[2, 'Message must contain atleast 2 characters!'],
        required: true
    }
}, {timestamps: true})

export const Message = mongoose.model("Message", messageSchema)
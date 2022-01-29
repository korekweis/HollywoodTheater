import mongoose from 'mongoose'

const userSchema = mongoose.Schema({ 
    firstName: String, 
    lastName: String, 
    email: String, 
    password: String, 
    confirmPassword: String, 
    kind: Number
})

export default mongoose.model('userContents', userSchema);
import mongoose from 'mongoose'

var Schema = mongoose.Schema;

const ticketSchema = mongoose.Schema({ 
    user: String, 
    movie: Schema.ObjectId,
    time: String,
    tickets: []
});

export default mongoose.model('ticketcontents', ticketSchema);
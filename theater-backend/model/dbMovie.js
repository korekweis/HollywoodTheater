import mongoose from 'mongoose'

const movieSchema = mongoose.Schema({ 
    image: String, 
    title: String, 
    rating: String, 
    length: String, 
    // timeslots: Array
    timeslots: [{
        id: Number, 
        time: String, 
        seats: []
    }]
});

export default mongoose.model('moviecontents', movieSchema);
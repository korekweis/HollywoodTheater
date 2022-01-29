import mongoose from 'mongoose';
// import seatsSchema from './dbSeats.js';

const rowsSchema = mongoose.Schema({ 
    // I'm going to copy the schema from the NPM docs
    // here's what I found on mongoose relations:
    // https://dev.to/mkilmer/how-create-relationships-with-mongoose-and-node-js-with-real-example-43ei
    // seats: [{id: Number, tooltip: String}],
    seats: []
    // {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'seatsContents'
    // }
})




export default mongoose.model('rowsContents', rowsSchema);


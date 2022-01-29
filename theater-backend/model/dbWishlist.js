import mongoose from 'mongoose';

var Schema = mongoose.Schema;

const wishlistSchema = mongoose.Schema({ 
    user: String, 
    movie: Schema.ObjectId
})

export default mongoose.model('wishlistcontents', wishlistSchema);
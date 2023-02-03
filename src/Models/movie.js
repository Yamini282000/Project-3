import { Schema, model } from 'sequelize'



const MoviesSchema = new Schema({
    movieName: {
        type: String,
        trim: true
    },
    like: {
        type: Number,
        trim: true
    },
    review: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        trim: true
    },
    genre: {
        type: String,
        trim: true
    },
    dateRelease: {
        type: String,
        trim: true
    }
})

const Movies = model('Movies', MoviesSchema)

export default Movies
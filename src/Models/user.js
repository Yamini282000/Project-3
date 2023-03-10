import { Schema, model } from 'sequelize'
import { isEmail } from 'validator'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

const userSchema = new Schema({
    Fname: {
        type: String,
        required: true,
        trim: true
    },
    Lname: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    Password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain password or name')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = sign({_id:user.id.toString()},'thisismyproject')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (Email,Password) => {
    const user = await User.findOne({Email})
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await compare(Password, user.Password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('Password')) {
        user.Password = await hash(user.Password, 8)
    }
    next()
})

const User = model('User', userSchema)

export default User
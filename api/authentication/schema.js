const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRound = process.env.SALT_WORK_FACTOR;


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
    
}, { timestamps: true })


userSchema.pre('save', async function(next) {
    const user = this;

    if(!user.isModified('password')) {
        return next();
    }

    try {
        const salt =  await bcrypt.genSalt(parseInt(saltRound, 10));
        user.password = await bcrypt.hash(user.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
    
})


userSchema.methods.comparePassword = async function(candidatePassword) {
    return await  bcrypt.compare(candidatePassword, this.password)
};

module.exports = mongoose.model('User', userSchema);

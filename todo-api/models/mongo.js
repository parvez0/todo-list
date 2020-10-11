const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema } = mongoose;
const Model = mongoose.model;

const mongodbConnectionUri = `${config.MONGODB.URI}/${config.MONGODB.DATABASE}?${config.MONGODB.ARGUMENTS}`;
logger.info(`Generated mongodb uri : ${mongodbConnectionUri}`);

/**
 * checking if mongodb is running otherwise don't start the project
 */
(async () => {
    try {
        await mongoose.connect(mongodbConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        logger.info('Mongodb connection established');
    } catch (e) {
        logger.error('Failed to established a connection with mongodb, exiting the process : ', e);
        process.exit(1);
    }
})();

/**
 * schema for users collection where users login information will be stored
 */
const usersSchema = new Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String },
    number: { type: Number },
    saltToken: { type: String },
    email: { type: String, index: { unique: true } },
    status: { type: String, default: true },
    roles: { type: Array },
    createdDate: { type: Date, default: Date.now() },
    updatedDate: { type: Date, default: Date.now() }
});

usersSchema.methods.setPassword = function (password) {

    /**
     * for creating a password we require a random string which will be appended with the original password
     * and a hash will be created.
     */
    this.saltToken = crypto.randomBytes(20).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.saltToken, 1024, 64, 'sha256').toString('hex');
};

usersSchema.methods.setUsername = function (email) {

    /**
     * creating unique username from email by replace special characters
     */
    this.username = email.replace(/@|\./ig, '');
};

usersSchema.methods.verifyPassword = function (password) {

    /**
     * password will be stored as a hash in the db, to verify the password provided by user first we need to create the hash and
     * then compare it with the original password's hash
     */
    const passwordHash = crypto.pbkdf2Sync(password, this.saltToken, 1024, 64, 'sha256').toString('hex');
    return passwordHash === this.password;
};

usersSchema.index({ email: 1, status: 1 });

/**
 * schema for sessions collection where session info of the users and there auth token will be stored
 */
const sessionSchema = new Schema({
    userId: { type: String, required: true },
    token: { type: String, required: true },
    ip: { type: String },
    device: { type: String },
    active: { type: Boolean, default: true, required: true },
    createdDate: { type: Date, default: Date.now() },
    updatedDate: { type: Date, default: Date.now() }
});

sessionSchema.index({ _id: 1, active: 1 });

/**
 * schema for todos collection where all the todos will be stored
 */
const todoSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    active: { type: String },
    createdDate: { type: Date, default: Date.now() },
    updatedDate: { type: Date, default: Date.now() }
});

todoSchema.index({ userId: 1 });
todoSchema.index({ userId: 1, active: 1 });

/**
 * collection models objects
 */
const Users = Model('users', usersSchema);
const Session = Model('sessions', sessionSchema);
const Todo = Model('todos', todoSchema)

module.exports = {
    mongoose,
    Users,
    Session,
    Todo
};

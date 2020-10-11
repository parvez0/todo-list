const { generateJWT } = require('./jwtHelper');
const { Users, Session } = require('./mongo');

/**
 * @param usernameOrEmail
 * @param password
 * @return {Promise<undefined|*>}
 */
const verifyUser = async (usernameOrEmail, password) => {
    try {
        const userDetails = await Users.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
        if (userDetails.verifyPassword(password)) {
            return generateJWT(userDetails);
        }
        return Promise.reject(new Error('Password doesn\'t match'));
    } catch (e) {
        logger.error(`Failed to login - ${usernameOrEmail} :`, e);
        return Promise.reject(new Error('Failed to verify password, encountered an error'));
    }
};

/**
 * @param fullName
 * @param username
 * @param email
 * @param password
 * @return {Promise<undefined|*>}
 */
const signup = async ({ fullName, username, email, password }) => {
    try {
        const userDetails = await Users.findOne({ $or: [{ username }, { email }] });
        if (userDetails) {
            return Promise.reject(new CustomError('Username or email already exists', 409));
        }
        const user = new Users();
        user.fullName = fullName;
        user.setUsername(email);
        user.email = email;
        user.status = 'active';
        user.setPassword(password);
        await user.save();
        return generateJWT(user);
    } catch (e) {
        logger.error(`Failed to sign up - ${email} :`, e);
        return Promise.reject(new CustomError('Failed to sign up, encountered an error.', 422));
    }
};

/**
 * @param sessionId
 * @param email
 * @return {Promise<void>}
 */
const logout = async (sessionId, email) => {
    try {
        const sessionDetails = await Session.findOne({ _id: sessionId });
        if (!sessionDetails) {
            logger.warn(`Illegal access by user ${email} session details not found`);
            return Promise.resolve();
        }
        sessionDetails.active = false;
        sessionDetails.updatedTime = new Date().toISOString();
        await sessionDetails.save();
    } catch (e) {
        logger.error(`Failed to logout user ${email} -`, e);
        return Promise.reject(new CustomError('Failed to logout, please try again.', 500));
    }
};

module.exports = {
    signup,
    verifyUser,
    logout
};

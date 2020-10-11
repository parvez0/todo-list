const { Users } = require('../models/mongo');

const startSeedOfUsers = async () => {
    try {
        const docsCount = await Users.estimatedDocumentCount();
        if (docsCount) {
            return;
        }
        logger.info('Starting the seed for first admin user');
        const user = new Users();
        user.fullName = 'Admin';
        user.email = 'admin@tech.com';
        user.number = 9876543211;
        user.roles = ['ADMIN'];
        user.setPassword('pa$$word');
        user.setUsername('admin@tech.com');
        await user.save();
        logger.info('Created admin user with password -', 'pa$$word');
    } catch (e) {
        logger.error('Failed to seed admin collection -', e);
    }
};

const startSeeding = async () => {
    if (config.MONGODB.SEEDING) {
        await startSeedOfUsers();
    }
};

module.exports = startSeeding;

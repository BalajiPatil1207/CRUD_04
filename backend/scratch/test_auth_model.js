require('dotenv').config();
const { connectSQLite, sequelize } = require('../src/config/sqliteDB');
const User = require('../src/models/authModel');

async function test() {
    try {
        await connectSQLite();
        await sequelize.sync({ force: true }); // Reset table for testing
        console.log('Database synced for testing.');

        // Test User Creation
        const testUser = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'mypassword123'
        });

        console.log('User created:', testUser.username);
        console.log('Hashed password:', testUser.password);

        // Verify password hashing worked
        if (testUser.password === 'mypassword123') {
            console.error('FAIL: Password was not hashed!');
        } else {
            console.log('SUCCESS: Password was hashed.');
        }

        // Test validPassword method
        const isValid = await testUser.validPassword('mypassword123');
        console.log('Password verification (correct):', isValid);

        const isInvalid = await testUser.validPassword('wrongpassword');
        console.log('Password verification (wrong):', isInvalid);

        if (isValid === true && isInvalid === false) {
            console.log('SUCCESS: validPassword method works correctly.');
        } else {
            console.error('FAIL: Password verification logic failed.');
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await sequelize.close();
    }
}

test();

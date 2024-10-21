import bcrypt from 'bcrypt';

const createHash = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

const compare = async (password, hashedPassword) => {
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    return passwordMatch;
};

export { createHash, compare };

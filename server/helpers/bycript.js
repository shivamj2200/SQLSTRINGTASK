const bcrypt = require("bcrypt");

bcryptPassword = async (plainPassword) => {
  const hashPassword = await bcrypt.hash(plainPassword, 10);
  return hashPassword;
};

compareHashPassword = async (plainPassword, hashPassword) => {
    const match = await bcrypt.compare(plainPassword, hashPassword);
    return match;
};
module.exports ={
    bcryptPassword,
    compareHashPassword
}
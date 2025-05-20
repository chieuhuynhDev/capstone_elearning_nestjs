import * as bcrypt from 'bcrypt';

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    return await bcrypt.hash(plainPassword, 10);
  } catch (error) {
    console.log('Error hashing password:', error);
  }
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hashPassword: string,
) => {
  try {
    return await bcrypt.compareSync(plainPassword, hashPassword);
  } catch (error) {
    console.log('Error comparing password:', error);
  }
};

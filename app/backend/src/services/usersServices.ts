import ErrorCode from '../CodeError';
import User from '../database/models/Users.model';

class UsersService {
  static async getOne(email: string, password: string) {
    const valid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g;
    if (!password || !email) {
      throw new ErrorCode('All fields must be filled', 400);
    }
    if (!valid.test(email)) {
      throw new ErrorCode('Incorrect email or password', 401);
    }
    const response = await User.findOne({ where: { email }, raw: true });
    if (!response) {
      throw new ErrorCode('Incorrect email or password', 401);
    }
    return response;
  }
}

export default UsersService;

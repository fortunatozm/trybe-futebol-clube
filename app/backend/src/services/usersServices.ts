import ErrorCode from '../CodeError';
import User from '../database/models/Users.model';

class UsersService {
  static async getOne(email: string) {
    const valid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g;
    console.log(email, valid);
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

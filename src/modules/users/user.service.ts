import { Op, WhereOptions } from "sequelize";
import { CreateUserDto } from "./user.interfaces";
import { User } from "../../database/models/user.model";
import { APIError } from "../../shared/errors";
import { createHash, verifyHash } from "../../utilities/hash.service";
import MailService from "../../utilities/mail.service";
import { TokenPayload } from "../auth/auth.interfaces";

class UserService {

  public async createNewUser(dto: CreateUserDto) {
    const { email, phoneNumber} = dto;
    // check if email or phone number already exists
    const [ emailExists, phoneNumberExists ] = await Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { phoneNumber } }),
    ]);

    if (emailExists) throw APIError.BadRequest('The email is already associated with an existing user');
    if (phoneNumberExists) throw APIError.BadRequest('The phone number is already associated with an existing user');

    const password = this.createRandomPassword();
    MailService.sendInitialPasswordEmail(email, password);

    const hashedPassword = await createHash(password);

    await User.create({
      ...dto,
      password: hashedPassword,
    });
  }

  public async getUserDetails(id: string) {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['password', 'refreshToken'],
      },
    });
    if (!user) throw APIError.NotFound('User not found');
    return user;
  }

  public async listAllUsers(query: any) {
    const { page, limit = 10, sortBy = 'createdAt', sort = 'desc', search } = query;
    const offset = (+page - 1) * limit;

    const where: WhereOptions = {
      isDeleted: false,
      ...(search && {
        [Op.or]: [
          { fullName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phoneNumber: { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    const { count, rows } = await User.findAndCountAll({
      where,
      distinct: true,
      attributes: { exclude: ['password', 'refreshToken'] },
      order: [[sortBy, sort]],
      limit,
      offset,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
      rows: rows,
    };
  }

  public async changePassword(dto: any, payload: TokenPayload) {
    const { oldPassword, newPassword, confirmPassword } = dto;
    if (newPassword !== confirmPassword) {
      throw APIError.BadRequest("New password and confirm password do not match");
    }

    if (oldPassword === newPassword) {
      throw APIError.BadRequest("New password cannot be the same as the old password");
    }

    const user = await User.findByPk(payload.id);
    if (!user) {
      throw APIError.NotFound("User not found");
    }

    const isPasswordValid = await verifyHash(oldPassword, user.dataValues.password);
    if (!isPasswordValid) {
      throw APIError.BadRequest("Old password is incorrect");
    }

    const hashedNewPassword = await createHash(newPassword);
    await user.update({
      password: hashedNewPassword,
      isFirstLogin: false,
    });
    return;
  }


  private createRandomPassword() {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "@#$%^&+!=*";
    const allCharacters = letters + numbers + symbols;

    const getRandomChar = (chars: string): string => chars[Math.floor(Math.random() * chars.length)];
    let password = getRandomChar(letters) + getRandomChar(numbers) + getRandomChar(symbols);

    for (let i = password.length; i < 12; i++) {
        password += getRandomChar(allCharacters);
    }

    const shuffledPassword = password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');

    return shuffledPassword;
  }
}

export default UserService;
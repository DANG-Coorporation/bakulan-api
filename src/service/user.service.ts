import { Op } from "sequelize";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import { NotFoundException } from "../helper/Error/NotFound/NotFoundException";
import { removeLimitAndPage } from "../helper/function/filteredData";
import { IPaginate } from "../helper/interface/paginate/paginate.interface";
import Users, { UserCreationAttributes } from "../database/models/user";
import {
  IAdmin,
  ICreateCashier,
} from "../helper/interface/user/create.admin.interface";
import bcrypt from "bcrypt";
import {
  ILoginRequest,
  ILoginResponse,
  IUser,
} from "../helper/interface/auth/login";
import JwtService from "./jwt.service";
import Merchants from "../database/models/merchant";

export default class UserService {
  jwtSrvice: JwtService;

  constructor() {
    this.jwtSrvice = new JwtService();
  }

  async create(input: UserCreationAttributes) {
    try {
      const user = await Users.create(input);
      return user;
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async createAdmin(input: IAdmin): Promise<Users> {
    try {
      const isExistUsername = await this.gets({ username: input.username });
      if (isExistUsername.length > 0)
        throw new BadRequestException("Username is exist", {});

      const isExistEmail = await this.gets({ email: input.email });
      if (isExistEmail.length > 0)
        throw new BadRequestException("Email is exist", {});

      const password = await bcrypt.hash(input.password, 10);
      const payload = {
        ...input,
        password,
        isAdmin: true,
      };
      const user = await this.create({
        ...payload,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createCashier(input: ICreateCashier, ownerId: number): Promise<Users> {
    try {
      const owner = await this.getById(ownerId);
      if (!owner.merchantId)
        throw new BadRequestException("Please add merchant first", {});
      const isExistUsername = await this.gets({ username: input.username });
      if (isExistUsername.length > 0)
        throw new BadRequestException("Username is exist", {});

      const isExistEmail = await this.gets({ email: input.email });
      if (isExistEmail.length > 0)
        throw new BadRequestException("Email is exist", {});

      const password = await bcrypt.hash(input.password, 10);
      const payload = {
        ...input,
        password,
        isAdmin: false,
        merchantId: owner.merchantId,
      };
      const user = await this.create({
        ...payload,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteCashier(id: number, ownerId: number) {
    try {
      const owner = await this.getById(ownerId);
      if (!owner.merchantId)
        throw new BadRequestException("Please add merchant first", {});
      const user = await this.getById(id);
      if (!user) throw new NotFoundException("Cashier not found", {});
      if (user.merchantId !== owner.merchantId)
        throw new BadRequestException("You are not owner of this cashier", {});
      if (user.isAdmin)
        throw new BadRequestException("You can't delete admin", {});
      const deletedUser = await this.deleteById(id);
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateCashier(
    id: number,
    input: Partial<UserCreationAttributes>,
    ownerId: number
  ) {
    try {
      const owner = await this.getById(ownerId);
      if (!owner.merchantId)
        throw new BadRequestException("Please add merchant first", {});
      const user = await this.getById(id);
      if (!user) throw new NotFoundException("Cashier not found", {});
      if (user.merchantId !== owner.merchantId)
        throw new BadRequestException("You are not owner of this cashier", {});
      if (user.isAdmin)
        throw new BadRequestException("You can't update admin", {});
      if (input.password) {
        const password = await bcrypt.hash(input.password, 10);
        input.password = password;
      }
      if (input.username) {
        const checkUser = await this.gets({ username: input.username });
        if (checkUser.length > 0) {
          throw new BadRequestException("Username is exist", {});
        }
      }

      if (input.email) {
        const checkEmail = await this.gets({ email: input.email });
        if (checkEmail.length > 0) {
          throw new BadRequestException("Email is exist", {});
        }
      }
      const payloadUpdate = {
        username: input.username != null ? input.username : user.username,
        email: input.email != null ? input.email : user.email,
        password: input.password != null ? input.password : user.password,
      };

      const updatedUser = await this.updateById(id, payloadUpdate);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async addMerchant(name: string, ownerId: number) {
    try {
      await this.getById(ownerId);
      const merchant = await Merchants.create({
        name,
      });

      await this.updateById(ownerId, {
        merchantId: merchant.id,
      });
      return merchant;
    } catch (error) {
      throw error;
    }
  }

  async login(input: ILoginRequest): Promise<ILoginResponse> {
    try {
      const user = await this.findOne({ username: input.username });
      if (!user) throw new NotFoundException("Credential is invalid", {});
      const isMatch = await bcrypt.compare(input.password, user.password);
      if (!isMatch) throw new BadRequestException("Credential is invalid", {});

      const payload: IUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      };

      const accessToken = await this.jwtSrvice.generateToken(payload);
      const refreshToken = await this.jwtSrvice.generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken,
        user: payload,
      };
    } catch (error) {
      throw error;
    }
  }

  async getRefreshToken(input: string): Promise<ILoginResponse> {
    try {
      const payload = await this.jwtSrvice.verifyRefreshToken(input);
      const user = await this.findOne({ id: payload.id });
      if (!user) throw new NotFoundException("Credential is invalid", {});

      const newPayload: IUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      };

      const accessToken = await this.jwtSrvice.generateToken(newPayload);
      const refreshToken = await this.jwtSrvice.generateRefreshToken(
        newPayload
      );

      return {
        accessToken,
        refreshToken,
        user: newPayload,
      };
    } catch (error) {
      throw error;
    }
  }

  async gets(conditions: Partial<UserCreationAttributes>) {
    try {
      const users = await Users.findAll({ where: conditions });
      return users;
    } catch (error: any) {
      throw new Error(`Error getting users: ${error.message}`);
    }
  }

  async findOne(conditions: Partial<UserCreationAttributes>) {
    try {
      const user = await Users.findOne({ where: conditions });
      if (!user) throw new NotFoundException("Users not found", {});
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const user = await Users.findByPk(id);
      if (!user) throw new NotFoundException("Users not found", {});
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async deleteById(id: number) {
    try {
      const user = await Users.destroy({ where: { id } });
      if (!user) throw new NotFoundException("Users not found", {});
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async updateById(
    id: number,
    input: Partial<UserCreationAttributes>
  ): Promise<Users> {
    try {
      const user = await Users.update(input, { where: { id } });
      if (!user) throw new NotFoundException("Users not found", {});
      const result = await this.getById(id);
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async page(input: IPaginate<UserCreationAttributes>) {
    try {
      const page = input.page ?? 1;
      const limit = input.limit ?? 10;
      const offset = Math.max(page - 1, 0) * limit;
      const conditions = removeLimitAndPage(input.data);
      const users = await Users.findAndCountAll({
        where: {
          username: {
            [Op.like]: `%${conditions.name}%`,
          },
        },
        limit,
        offset: offset,
        order: [["id", "DESC"]],
      });
      return users;
    } catch (error: any) {
      throw new BadRequestException(`Error paginating users: ${error.message}`);
    }
  }
}

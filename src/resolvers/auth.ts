import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { config } from "../config";
import { User } from "../entities";
import { MyContext } from "../server";
import { token, TokenType, random } from "../services";
import { verifyPassword, hashPassword } from "../services/password";
import moment = require("moment");
import { CookieOptions } from "express";

@Resolver()
export class AuthResolver {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  @Mutation(() => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User> {
    const user = await this.userRepository.findOne(undefined, {
      where: { email }
    });
    if (!user) {
      throw new Error("User not found.");
    }
    if (!verifyPassword(password, user.passwordHash)) {
      throw new Error("Wrong password.");
    }
    const jwsToken = token.newToken(
      { email: user.email, id: user.id },
      TokenType.Access,
      10
    );
    const jws = token.sign(jwsToken);
    console.log(jwsToken);
    console.log(moment.unix(jwsToken.iat).toISOString());
    console.log(moment.unix(jwsToken.exp).toISOString());
    console.log(moment.unix(jwsToken.exp) > moment());
    console.log(moment.unix(jwsToken.iat) > moment());
    const options: CookieOptions = {
      // expires: moment.unix(jwsToken.exp).toDate(),
      secure: ctx.request.secure,
      httpOnly: true,
      // overwrite: true,
      sameSite: "strict" as "strict"
    };
    ctx.response.cookie(config.ACCESS_TOKEN_COOKIE_NAME, jws, options);
    return user;
  }

  @Authorized()
  @Mutation(() => User)
  async register(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const user = await this.userRepository.findOne(undefined, {
      where: { email }
    });
    if (user) {
      throw new Error("User with email already exists.");
    }
    const passwordHash = await hashPassword(password);
    const newUser = new User(random.secureId(), email, name, passwordHash);
    return await this.userRepository.save(newUser);
  }
}

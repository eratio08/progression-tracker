import { CookieOptions } from "express";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { config } from "../config";
import { User } from "../entities";
import { AppContext } from "../server";
import { token, TokenType } from "../services";
import { verifyPassword } from "../services/password";
import * as moment from "moment";

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
    @Ctx() ctx: AppContext
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
    const options: CookieOptions = {
      expires: moment.unix(jwsToken.exp).toDate(),
      secure: ctx.request.secure,
      httpOnly: true,
      sameSite: "strict" as "strict"
    };
    ctx.response.cookie(config.ACCESS_TOKEN_COOKIE_NAME, jws, options);
    return user;
  }
}

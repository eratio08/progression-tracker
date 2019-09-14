import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { User } from "../entities";
import { AppContext } from "../server";
import { cookie, passwd } from "../services";

@Resolver()
export class AuthResolver {
  constructor(private userRepository: Repository<User>) {}

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
    if (!passwd.verify(password, user.passwordHash)) {
      throw new Error("Wrong password.");
    }
    cookie.setAccessToken(user, ctx);
    return user;
  }
}

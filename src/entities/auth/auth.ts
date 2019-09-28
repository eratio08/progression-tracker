import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { User } from "..";
import { AppContext } from "../../server";
import * as services from "../../services";

@Resolver()
export class AuthResolver {
  constructor(private userRepository: Repository<User>) {}

  @Mutation(() => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") pw: string,
    @Ctx() ctx: AppContext
  ): Promise<User> {
    const user = await this.userRepository.findOne(undefined, {
      where: { email }
    });
    if (!user) {
      throw new Error("User not found.");
    }
    if (!services.password.verify(pw, user.passwordHash)) {
      throw new Error("Wrong password.");
    }
    services.cookie.setAccessToken(user, ctx);
    return user;
  }
}

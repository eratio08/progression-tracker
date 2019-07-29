import { Arg, Query, Resolver, Authorized } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { User } from "../entities";

@Resolver(_ => User)
export class UserResolver {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  @Query(_ => User)
  @Authorized()
  async user(@Arg("id") id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new Error(`User ${id} not found.`);
    }
    return user;
  }

  @Query(_ => [User])
  async users(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }
}

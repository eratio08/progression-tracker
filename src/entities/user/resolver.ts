import {
  Arg,
  Authorized,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { hashPassword, random } from "../../services";
import { EntityResolver } from "../entity-resolver";
import { User } from "./model";
import { logger } from "../../services/logger";

@InputType()
class UserUpdates implements Partial<User> {
  @Field()
  public id!: string;

  @Field({ nullable: true })
  public email?: string;

  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public password?: string;
}

@Resolver(_ => User)
export class UserResolver extends EntityResolver<User> {
  constructor() {
    super(User);
  }

  @Authorized()
  @Query(_ => User)
  async user(@Arg("id") id: string): Promise<User> {
    const user = await this.repository.findOneOrFail(id, {
      relations: ["plans"]
    });
    return user;
  }

  @Authorized()
  @Query(_ => [User])
  async users(): Promise<User[]> {
    const users = await this.repository.find({
      relations: ["plans"]
    });
    return users;
  }

  @Authorized()
  @Mutation(() => User)
  async createUser(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const user = await this.repository.findOne(undefined, {
      where: { email },
      relations: ["plans"]
    });
    if (user) {
      throw new Error("User with email already exists.");
    }
    const passwordHash = await hashPassword(password);
    const newUser = new User(random.secureId(), email, name, passwordHash);
    const created = await this.repository.save(newUser);
    logger.debug(created);
    return created;
  }

  @Authorized()
  @Mutation(_ => User)
  async updateUser(@Arg("user") changes: UserUpdates): Promise<User> {
    const { id, password, ...rest } = changes;
    const updates: Partial<User> = { ...rest };
    if (password) {
      const hash = await hashPassword(password);
      updates.passwordHash = hash;
    }
    await this.repository.update({ id }, { ...updates });
    return this.repository.findOneOrFail(id);
  }

  @Authorized()
  @Mutation(_ => String)
  async deleteUser(@Arg("id") id: string): Promise<"Deleted"> {
    await this.repository.findOneOrFail(id);
    await this.repository.delete(id);
    return `Deleted`;
  }
}

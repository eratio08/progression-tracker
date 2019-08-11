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
      // relations: ["plans"]
    });
    return user;
  }

  @Authorized()
  @Query(_ => [User])
  async users(): Promise<User[]> {
    const users = await this.repository.find({
      // relations: ["plans"]
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
    return await this.repository.save(newUser);
  }

  @Authorized()
  @Mutation(_ => User)
  async updateUser(@Arg("user") updates: UserUpdates): Promise<User> {
    const { id } = updates;
    if (!id) {
      throw new Error("Invalid request body.");
    }
    const user = await this.repository.findOneOrFail(id);
    if (updates.email) {
      user.email = updates.email;
    }
    if (updates.name) {
      user.name = updates.name;
    }
    if (updates.password) {
      const hash = await hashPassword(updates.password);
      user.passwordHash = hash;
    }
    const updatedUser = await this.repository.save(user);
    return updatedUser;
  }

  @Authorized()
  @Mutation(_ => String)
  async deleteUser(@Arg("id") id: string): Promise<string> {
    const result = await this.repository.delete(id);
    if (result.affected) {
      return `Deleted user ${id}.`;
    }
    throw new Error("Error could not be deleted.");
  }
}

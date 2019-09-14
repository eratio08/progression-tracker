import {
  Arg,
  Args,
  Authorized,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql";
import { getRepository, In, Repository } from "typeorm";
import { passwd, random } from "../../services";
import { logger } from "../../services/logger";
import { PagingArgs } from "../paging-args";
import { Plan } from "../plan";
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
export class UserResolver {
  constructor(protected repository: Repository<User>) {}

  @Authorized()
  @Query(_ => User)
  async user(@Arg("id") id: string): Promise<User> {
    const user = await this.repository.findOneOrFail(id, {
      loadRelationIds: true
    });
    return user;
  }

  @Authorized()
  @Query(_ => [User])
  async users(@Args() { skip, take }: PagingArgs): Promise<User[]> {
    const users = await this.repository.find({
      loadRelationIds: true,
      skip,
      take
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
      loadRelationIds: true
    });
    if (user) {
      throw new Error("User with email already exists.");
    }
    const passwordHash = await passwd.hash(password);
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
      const hash = await passwd.hash(password);
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

  @FieldResolver()
  async plans(@Root() { plans }: User): Promise<Plan[]> {
    if (plans.length > 0) {
      if (typeof plans[0] === "string") {
        const planRepository = getRepository(Plan);
        return await planRepository.find({
          where: { id: In(plans as string[]) }
        });
      }
      return plans as Plan[];
    }
    return [];
  }
}

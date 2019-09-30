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
  Root,
  ArgsType
} from "type-graphql";
import { In, Repository } from "typeorm";
import * as services from "../../services";
import { logger } from "../../services/logger";
import { PagingArgs } from "../paging-args";
import { Plan } from "../plan";
import { User } from "./model";
import { IsEmail } from "class-validator";

@InputType()
class UserUpdates implements Partial<User> {
  @Field()
  public id!: string;

  @Field({ nullable: true })
  @IsEmail()
  public email?: string;

  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public password?: string;
}

@ArgsType()
class AddUserArgs {
  @Field()
  name!: string;
  @Field()
  @IsEmail()
  email!: string;
  @Field()
  password!: string;
}

@Resolver(_ => User)
export class UserResolver {
  constructor(
    private readonly repository: Repository<User>,
    private readonly planRepository: Repository<Plan>
  ) {}

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
  async addUser(@Args() { email, name, password }: AddUserArgs): Promise<User> {
    const user = await this.repository.findOne(undefined, {
      where: { email },
      loadRelationIds: true
    });
    if (user) {
      throw new Error("User with email already exists.");
    }
    const passwordHash = await services.password.hash(password);
    const newUser = new User(
      services.random.secureId(),
      email,
      name,
      passwordHash
    );
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
      const hash = await services.password.hash(password);
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
    if (plans && plans.length > 0) {
      if (typeof plans[0] === "string") {
        return await this.planRepository.find({
          where: { id: In(plans as string[]) }
        });
      }
      return plans as Plan[];
    }
    return [];
  }
}

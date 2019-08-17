import { getRepository, ObjectType, Repository } from "typeorm";

export abstract class EntityResolver<T extends { id: string }> {
  protected repository: Repository<T>;

  constructor(entityType: ObjectType<T>) {
    this.repository = getRepository(entityType);
  }
}

// export function createBaseEntityResolver<
//   T extends ClassType<E>,
//   E extends { id: string }
// >(suffix: string, entity: T) {
//   @Resolver({ isAbstract: true })
//   abstract class BaseEntityResolver {
//     protected repository = getRepository(entity);

//     @Authorized()
//     @Query(_ => [entity], {
//       name: `get${suffix}s`,
//       description: `Retrieves a page of ${suffix}s.`
//     })
//     async getAll(
//       @Arg("take", { nullable: true, defaultValue: 10 }) take: number = 10,
//       @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number = 0,
//       @Ctx() ctx: AppContext,
//       @Arg("userId", { nullable: true }) userId?: string
//     ): Promise<E[]> {
//       if (
//         userId &&
//         userId !== ctx.request.authUser!.id &&
//         ctx.request.authUser!.role !== UserRole.ADMIN
//       ) {
//         throw new Error("Forbidden access.");
//       }
//       const entities = await this.repository.find({ take, skip });
//       return entities;
//     }

//     @Authorized()
//     @Query(_ => entity, { name: `get${suffix}` })
//     async get(@Arg("id") id: string, @Ctx() ctx: AppContext): Promise<E> {

//     }
//   }

//   return BaseEntityResolver;
// }

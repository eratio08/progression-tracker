import { Max, Min } from "class-validator";
import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class PagingArgs {
  @Min(1)
  @Max(50)
  @Field(_ => Int, { nullable: true, defaultValue: 10 })
  take?: number = 10;

  @Min(0)
  @Field(_ => Int, { nullable: true, defaultValue: 0 })
  skip?: number = 0;
}

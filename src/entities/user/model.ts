import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { Plan } from "../plan";

@ObjectType()
@Entity()
export class User {
  @Field(_ => ID)
  @PrimaryColumn()
  id: string;
  @Field()
  @Column({
    length: 80
  })
  name: string;
  @Field()
  @Column()
  email: string;
  @Column()
  passwordHash: string;

  @Field(_ => Plan, { nullable: true })
  @OneToMany(_ => Plan, plan => plan.user)
  plans?: Plan[];

  constructor(id: string, email: string, name: string, passwordHash: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.passwordHash = passwordHash;
  }

  toJSON() {
    const { id, name, email, plans } = this;
    return {
      id,
      name,
      email,
      plans
    };
  }
}

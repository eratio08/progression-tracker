import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { Plan } from "../plan";

export enum UserRole {
  USER = "user",
  ADMIN = "admin"
}

registerEnumType(UserRole, {
  name: "UserRole",
  description: "Role of a user."
});

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
  @Field(_ => UserRole)
  @Column({ default: UserRole.USER })
  role: UserRole;

  @Field(_ => Plan, { nullable: true })
  @OneToMany(_ => Plan, plan => plan.user)
  plans?: Plan[];

  constructor(
    id: string,
    email: string,
    name: string,
    passwordHash: string,
    role: UserRole = UserRole.ADMIN
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  toJSON() {
    const { id, name, email, role, plans } = this;
    return {
      id,
      name,
      email,
      role,
      plans
    };
  }
}

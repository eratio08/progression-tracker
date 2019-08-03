import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Plan } from "./plan";

@ObjectType()
@Entity()
export class User {
  @Field(_ => ID)
  @PrimaryColumn()
  public id: string;
  @Field()
  @Column({
    length: 80
  })
  public name: string;
  @Column()
  public email: string;
  @Column()
  public passwordHash: string;

  @Field(_ => Plan)
  @OneToMany(_ => Plan, plan => plan.user)
  public plans!: Plan[];

  constructor(id: string, email: string, name: string, passwordHash: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.passwordHash = passwordHash;
  }

  toJSON() {
    const { id, name, email, plans } = this;
    return { id, name, email, plans };
  }
}

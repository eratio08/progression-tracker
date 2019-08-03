"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const exercise_1 = require("./exercise");
const user_1 = require("./user");
const training_1 = require("./training");
const type_graphql_1 = require("type-graphql");
let Plan = class Plan {
    constructor(id, name, user) {
        this.id = id;
        this.name = name;
        this.user = user;
    }
};
__decorate([
    type_graphql_1.Field(_ => type_graphql_1.ID),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Plan.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Plan.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Plan.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(_ => user_1.User),
    typeorm_1.ManyToOne(_ => user_1.User, user => user.plans),
    __metadata("design:type", user_1.User)
], Plan.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(_ => exercise_1.Exercise),
    typeorm_1.ManyToMany(_ => exercise_1.Exercise, exercise => exercise.plan),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Plan.prototype, "exercises", void 0);
__decorate([
    type_graphql_1.Field(_ => training_1.Training),
    typeorm_1.OneToMany(_ => training_1.Training, training => training.plan),
    __metadata("design:type", Array)
], Plan.prototype, "trainings", void 0);
Plan = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, String, user_1.User])
], Plan);
exports.Plan = Plan;

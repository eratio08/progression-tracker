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
const plan_1 = require("./plan");
const type_graphql_1 = require("type-graphql");
var ExerciseType;
(function (ExerciseType) {
    ExerciseType["PUSH"] = "push";
    ExerciseType["PULL"] = "pull";
    ExerciseType["CARDIO"] = "cardio";
})(ExerciseType || (ExerciseType = {}));
type_graphql_1.registerEnumType(ExerciseType, {
    name: "ExerciseType"
});
let Exercise = class Exercise {
    constructor(id, name, type, plan) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.plan = plan;
    }
};
__decorate([
    type_graphql_1.Field(_ => type_graphql_1.ID),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Exercise.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Exercise.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(_ => ExerciseType),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Exercise.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToMany(_ => plan_1.Plan, plan => plan.exercises),
    __metadata("design:type", plan_1.Plan)
], Exercise.prototype, "plan", void 0);
Exercise = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, String, String, plan_1.Plan])
], Exercise);
exports.Exercise = Exercise;

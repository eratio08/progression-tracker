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
const exercise_execution_1 = require("./exercise-execution");
const type_graphql_1 = require("type-graphql");
let Set = class Set {
    constructor(id, nr, weight, reps, targetVolumen, targetWeight, targetReps, exerciseExecution) {
        this.id = id;
        this.nr = nr;
        this.weight = weight;
        this.reps = reps;
        this.targetVolumen = targetVolumen;
        this.targetWeight = targetWeight;
        this.targetReps = targetReps;
        this.exerciseExecution = exerciseExecution;
    }
};
__decorate([
    type_graphql_1.Field(_ => type_graphql_1.ID),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Set.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: "integer" }),
    __metadata("design:type", Number)
], Set.prototype, "nr", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Set.prototype, "weight", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: "integer" }),
    __metadata("design:type", Number)
], Set.prototype, "reps", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Set.prototype, "targetVolumen", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Set.prototype, "targetWeight", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: "integer" }),
    __metadata("design:type", Number)
], Set.prototype, "targetReps", void 0);
__decorate([
    type_graphql_1.Field(_ => exercise_execution_1.ExerciseExecution),
    typeorm_1.ManyToOne(_ => exercise_execution_1.ExerciseExecution),
    __metadata("design:type", exercise_execution_1.ExerciseExecution)
], Set.prototype, "exerciseExecution", void 0);
Set = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, Number, Number, Number, Number, Number, Number, exercise_execution_1.ExerciseExecution])
], Set);
exports.Set = Set;

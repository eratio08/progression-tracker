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
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const exercise_1 = require("./exercise");
const training_1 = require("./training");
let ExerciseExecution = class ExerciseExecution {
    constructor(id, training, exercise) {
        this.id = id;
        this.traning = training;
        this.exercise = exercise;
    }
};
__decorate([
    type_graphql_1.Field(_ => type_graphql_1.ID),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], ExerciseExecution.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => training_1.Training, training => training.exerciseExecutions),
    __metadata("design:type", training_1.Training)
], ExerciseExecution.prototype, "traning", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => exercise_1.Exercise),
    __metadata("design:type", exercise_1.Exercise)
], ExerciseExecution.prototype, "exercise", void 0);
ExerciseExecution = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, training_1.Training, exercise_1.Exercise])
], ExerciseExecution);
exports.ExerciseExecution = ExerciseExecution;

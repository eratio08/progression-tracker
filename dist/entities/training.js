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
const exercise_execution_1 = require("./exercise-execution");
const type_graphql_1 = require("type-graphql");
let Training = class Training {
    constructor(id, date, plan) {
        this.id = id;
        this.date = date;
        this.plan = plan;
    }
};
__decorate([
    type_graphql_1.Field(_ => type_graphql_1.ID),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Training.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Training.prototype, "date", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => plan_1.Plan, plan => plan.trainings),
    __metadata("design:type", plan_1.Plan)
], Training.prototype, "plan", void 0);
__decorate([
    typeorm_1.OneToMany(_ => exercise_execution_1.ExerciseExecution, exerciseExecution => exerciseExecution.traning),
    __metadata("design:type", Array)
], Training.prototype, "exerciseExecutions", void 0);
Training = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, Date, plan_1.Plan])
], Training);
exports.Training = Training;

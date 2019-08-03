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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const config_1 = require("../config");
const entities_1 = require("../entities");
const services_1 = require("../services");
const password_1 = require("../services/password");
const moment = require("moment");
let AuthResolver = class AuthResolver {
    constructor() {
        this.userRepository = typeorm_1.getRepository(entities_1.User);
    }
    async login(email, password, ctx) {
        const user = await this.userRepository.findOne(undefined, {
            where: { email }
        });
        if (!user) {
            throw new Error("User not found.");
        }
        if (!password_1.verifyPassword(password, user.passwordHash)) {
            throw new Error("Wrong password.");
        }
        const jwsToken = services_1.token.newToken({ email: user.email, id: user.id }, services_1.TokenType.Access, 10);
        const jws = services_1.token.sign(jwsToken);
        const options = {
            expires: moment.unix(jwsToken.exp).toDate(),
            secure: ctx.request.secure,
            httpOnly: true,
            overwrite: true,
            sameSite: "strict"
        };
        ctx.response.cookie(config_1.config.ACCESS_TOKEN_COOKIE_NAME, jws, options);
        return user;
    }
    async register(name, email, password) {
        const user = await this.userRepository.findOne(undefined, {
            where: { email }
        });
        if (user) {
            throw new Error("User with email already exists.");
        }
        const passwordHash = await password_1.hashPassword(password);
        const newUser = new entities_1.User(services_1.random.secureId(), email, name, passwordHash);
        return await this.userRepository.save(newUser);
    }
};
__decorate([
    type_graphql_1.Mutation(() => entities_1.User),
    __param(0, type_graphql_1.Arg("email")),
    __param(1, type_graphql_1.Arg("password")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Authorized(),
    type_graphql_1.Mutation(() => entities_1.User),
    __param(0, type_graphql_1.Arg("name")),
    __param(1, type_graphql_1.Arg("email")),
    __param(2, type_graphql_1.Arg("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "register", null);
AuthResolver = __decorate([
    type_graphql_1.Resolver(),
    __metadata("design:paramtypes", [])
], AuthResolver);
exports.AuthResolver = AuthResolver;

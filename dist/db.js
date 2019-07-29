"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
// uses the typeorm.json
exports.db = async () => {
    try {
        const connection = await typeorm_1.createConnection();
        console.log("DB connected");
        return connection;
    }
    catch (error) {
        console.error("DB connection error:", error);
        return undefined;
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const db_1 = require("./db");
const server_1 = require("./server");
db_1.db();
server_1.server.start(() => "GraphQL server running on :4000");

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customServer = void 0;
const next_dev_server_1 = require("next/dist/server/next-dev-server");
const path = require("path");
function customServer(settings, proxyConfig) {
    const nextApp = new next_dev_server_1.default(settings);
    return require(path.resolve(settings.dir, settings.path))(nextApp, settings, proxyConfig);
}
exports.customServer = customServer;
//# sourceMappingURL=custom-server.js.map
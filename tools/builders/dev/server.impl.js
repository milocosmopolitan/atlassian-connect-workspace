"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const architect_1 = require("@angular-devkit/architect");
const core_1 = require("@angular-devkit/core");
const fs = require("fs");
const constants_1 = require("next/dist/next-server/lib/constants");
const path = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const config_1 = require("./lib/utils/config");
const custom_server_1 = require("./lib/custom-server");
const default_server_1 = require("./lib/default-server");
try {
    require('dotenv').config();
}
catch (e) { }
exports.default = architect_1.createBuilder(run);
const infoPrefix = `[ ${core_1.terminal.dim(core_1.terminal.cyan('info'))} ] `;
const readyPrefix = `[ ${core_1.terminal.green('ready')} ]`;
function run(options, context) {
    const buildTarget = architect_1.targetFromTargetString(options.buildTarget);
    const baseUrl = `http://${options.hostname || 'localhost'}:${options.port}`;
    return rxjs_1.from(context.getTargetOptions(buildTarget)).pipe(operators_1.concatMap((buildOptions) => {
        const root = path.resolve(context.workspaceRoot, buildOptions.root);
        const config = config_1.prepareConfig(options.dev ? constants_1.PHASE_DEVELOPMENT_SERVER : constants_1.PHASE_PRODUCTION_SERVER, buildOptions, context);
        const settings = {
            dev: options.dev,
            dir: root,
            staticMarkup: options.staticMarkup,
            quiet: options.quiet,
            conf: config,
            port: options.port,
            path: options.customServerPath,
            hostname: options.hostname,
        };
        const server = options.customServerPath
            ? custom_server_1.customServer
            : default_server_1.defaultServer;
        // look for the proxy.conf.json
        let proxyConfig;
        const proxyConfigPath = options.proxyConfig
            ? path.join(context.workspaceRoot, options.proxyConfig)
            : path.join(root, 'proxy.conf.json');
        if (fs.existsSync(proxyConfigPath)) {
            context.logger.info(`${infoPrefix} found proxy configuration at ${proxyConfigPath}`);
            proxyConfig = require(proxyConfigPath);
        }
        return rxjs_1.from(server(settings, proxyConfig)).pipe(operators_1.catchError((err) => {
            if (options.dev) {
                throw err;
            }
            else {
                throw new Error(`Could not start production server. Try building your app with \`nx build ${context.target.project}\`.`);
            }
        }), operators_1.tap(() => {
            context.logger.info(`${readyPrefix} on ${baseUrl}`);
        }), operators_1.switchMap((e) => new rxjs_1.Observable((obs) => {
            obs.next({
                baseUrl,
                success: true,
            });
        })));
    }));
}
exports.run = run;
//# sourceMappingURL=server.impl.js.map
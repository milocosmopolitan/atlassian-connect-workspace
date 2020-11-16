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
const default_server_1 = require("./lib/default-server");
// import * as JsonPostProcessPlugin from 'json-post-process-webpack-plugin';
// import { json } from '@angular-devkit/core';
// interface Options extends json.JsonObject, NextServeBuilderOptions {}
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
        context.logger.info(`options.hostname: ${options.hostname}`, options);
        context.logger.info(`options.port: ${options.port}`, options);
        // const server: NextServer = options.customServerPath
        //   ? customServer
        //   : defaultServer;
        const server = default_server_1.aceServer;
        // look for the proxy.conf.json
        let proxyConfig;
        const proxyConfigPath = options.proxyConfig
            ? path.join(context.workspaceRoot, options.proxyConfig)
            : path.join(root, 'proxy.conf.json');
        if (fs.existsSync(proxyConfigPath)) {
            context.logger.info(`${infoPrefix} found proxy configuration at ${proxyConfigPath}`);
            proxyConfig = require(proxyConfigPath);
        }
        context.logger.info('RUN RXJS');
        context.logger.info(Object.keys(settings).join());
        return rxjs_1.from(server(settings, context.logger, proxyConfig)
        // .then(() => {
        //   const acConfigPath = path.resolve(process.cwd(), buildOptions.outputPath, 'public', 'atlassian-connect.json');
        //   const acConfigFile = fs.readFileSync(acConfigPath, {encoding: 'utf-8'});
        //   const acConfig = JSON.parse(acConfigFile);
        //   acConfig.baseUrl = tunnel;
        //   fs.writeFileSync(acConfigPath, JSON.stringify(acConfig, null, 2));
        //   context.logger.info(`${infoPrefix} baseUrl to ngrok tunnel uri ${tunnel} at ${acConfigPath.replace(process.cwd(), '.')}`);
        // });
        // 
        // createTunnel(settings, context.logger)
        //   .then(tunnel => {
        //     context.logger.info(`tunnel: ${tunnel}`);
        //     settings.conf = prepareConfig(
        //       options.dev ? PHASE_DEVELOPMENT_SERVER : PHASE_PRODUCTION_SERVER,
        //       buildOptions,
        //       context
        //     );
        //     return server(settings, context.logger, proxyConfig)
        //       .then(() => {
        //         const acConfigPath = path.resolve(process.cwd(), buildOptions.outputPath, 'public', 'atlassian-connect.json');
        //         const acConfigFile = fs.readFileSync(acConfigPath, {encoding: 'utf-8'});
        //         const acConfig = JSON.parse(acConfigFile);
        //         acConfig.baseUrl = tunnel;
        //         fs.writeFileSync(acConfigPath, JSON.stringify(acConfig, null, 2));
        //         context.logger.info(`${infoPrefix} baseUrl to ngrok tunnel uri ${tunnel} at ${acConfigPath.replace(process.cwd(), '.')}`);
        //       });
        //   })
        //   .catch(console.error)
        // defaultServer(settings, proxyConfig)
        ).pipe(operators_1.catchError((err) => {
            if (options.dev) {
                context.logger.info('DEV ERROR');
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
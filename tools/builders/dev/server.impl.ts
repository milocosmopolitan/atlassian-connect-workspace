import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
  targetFromTargetString,
} from '@angular-devkit/architect';
import { terminal } from '@angular-devkit/core';
import * as fs from 'fs';
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_SERVER,
} from 'next/dist/next-server/lib/constants';
import * as path from 'path';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, switchMap, tap } from 'rxjs/operators';
import {
  NextBuildBuilderOptions,
  NextServeBuilderOptions,
  NextServer,
  NextServerOptions,
  ProxyConfig,
} from '@nrwl/next';
import { prepareConfig, createWebpackConfig } from './lib/utils/config';
import { customServer } from './lib/custom-server';
import { defaultServer, aceServer } from './lib/default-server';
import { createTunnel } from './lib/create-dev-tunnel';
// import * as JsonPostProcessPlugin from 'json-post-process-webpack-plugin';
// import { json } from '@angular-devkit/core';

// interface Options extends json.JsonObject, NextServeBuilderOptions {}

try {
  require('dotenv').config();
} catch (e) {}

export default createBuilder<NextServeBuilderOptions>(run);

const infoPrefix = `[ ${terminal.dim(terminal.cyan('info'))} ] `;
const readyPrefix = `[ ${terminal.green('ready')} ]`;

export function run(
  options: NextServeBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  const buildTarget = targetFromTargetString(options.buildTarget);
  const baseUrl = `http://${options.hostname || 'localhost'}:${options.port}`;

  return from(context.getTargetOptions(buildTarget)).pipe(
    concatMap((buildOptions: NextBuildBuilderOptions) => {
      const root = path.resolve(context.workspaceRoot, buildOptions.root);

      const config = prepareConfig(
        options.dev ? PHASE_DEVELOPMENT_SERVER : PHASE_PRODUCTION_SERVER,
        buildOptions,
        context
      );

      const settings: NextServerOptions = {
        dev: options.dev,
        dir: root,
        staticMarkup: options.staticMarkup,
        quiet: options.quiet,
        conf: config,
        port: options.port,
        path: options.customServerPath,
        hostname: options.hostname,
      };

      context.logger.info(
        `options.hostname: ${options.hostname}`, options
      );
      context.logger.info(
        `options.port: ${options.port}`, options
      );

      // const server: NextServer = options.customServerPath
      //   ? customServer
      //   : defaultServer;
      const server = aceServer;

      // look for the proxy.conf.json
      let proxyConfig: ProxyConfig;
      const proxyConfigPath = options.proxyConfig
        ? path.join(context.workspaceRoot, options.proxyConfig)
        : path.join(root, 'proxy.conf.json');
      if (fs.existsSync(proxyConfigPath)) {
        context.logger.info(
          `${infoPrefix} found proxy configuration at ${proxyConfigPath}`
        );
        proxyConfig = require(proxyConfigPath);
      }

      context.logger.info('RUN RXJS');
      context.logger.info(Object.keys(settings).join());
      return from(
        server(settings, context.logger, proxyConfig)
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
        ).pipe(
        catchError((err) => {
          if (options.dev) {
            context.logger.info('DEV ERROR');
            throw err;
          } else {
            throw new Error(
              `Could not start production server. Try building your app with \`nx build ${context.target.project}\`.`
            );
          }
        }),
        tap(() => {
          context.logger.info(`${readyPrefix} on ${baseUrl}`);
        }),
        switchMap(
          (e) =>
            new Observable<BuilderOutput>((obs) => {
              obs.next({
                baseUrl,
                success: true,
              });
            })
        )
      );
    })
  );
}

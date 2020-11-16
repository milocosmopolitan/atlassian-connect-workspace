"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aceServer = exports.defaultServer = void 0;
const tslib_1 = require("tslib");
const express = require("express");
// https://expressjs.com/en/guide/using-middleware.html
const morgan = require("morgan");
// atlassian-connect-express also provides a middleware
const ace = require("atlassian-connect-express");
const next_1 = require("next");
// import { createTunnel } from './create-dev-tunnel';
/**
 * Adapted from https://github.com/zeit/next.js/blob/master/examples/with-custom-reverse-proxy/server.js
 * @param settings
 */
function defaultServer(settings, proxyConfig) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = next_1.default(settings);
        const handle = app.getRequestHandler();
        yield app.prepare();
        const server = express();
        // const addon = ace(server);
        // server.use(addon.middleware());
        // Log requests, using an appropriate formatter by env
        // const morganFormat: string = settings.dev ? 'dev' : 'combined';
        // server.use(morgan(morganFormat));
        // Set up the proxy.
        if (proxyConfig) {
            const proxyMiddleware = require('http-proxy-middleware');
            Object.keys(proxyConfig).forEach((context) => {
                server.use(proxyMiddleware(context, proxyConfig[context]));
            });
        }
        // console.log(settings)
        // Default catch-all handler to allow Next.js to handle all other routes
        server.all('*', (req, res) => handle(req, res));
        // server.listen(settings.port, settings.hostname);
        server.listen(settings.port, settings.hostname, () => {
            // console.log('App server running at http://' + settings.hostname, + ':' + settings.port);
            // Enables auto registration/de-registration of app into a host in dev mode
            // if (settings.dev) {
            //   (addon as any).register()
            // }
        });
    });
}
exports.defaultServer = defaultServer;
/**
 * Adapted from https://github.com/zeit/next.js/blob/master/examples/with-custom-reverse-proxy/server.js
 * @param settings
 */
function aceServer(settings, logger, proxyConfig) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = next_1.default(settings);
        const handle = app.getRequestHandler();
        yield app.prepare();
        const server = express();
        const morganFormat = settings.dev ? 'dev' : 'combined';
        server.use(morgan(morganFormat));
        // https://bitbucket.org/atlassian/atlassian-connect-express/src/7aaab3f3fafe55bfb35953248295acfad1319d58/lib/internal/config.js?at=master#lines-202
        const addon = ace(server, {
            port: settings.port,
            errorTemplate: true,
            store: {
                "adapter": "sequelize",
                "dialect": "sqlite3",
                "logging": false,
                "type": "memory"
            },
            product: "jira",
        }, logger);
        server.use(addon.middleware());
        server.get('/', (req, res) => {
            res.redirect('/atlassian-connect.json');
        });
        server.get('/atlassian-connect.json', (req, res) => {
            res.json(addon.descriptor);
        });
        // Log requests, using an appropriate formatter by env
        // const morganFormat: string = settings.dev ? 'dev' : 'combined';
        // server.use(morgan(morganFormat));
        // Set up the proxy.
        if (proxyConfig) {
            const proxyMiddleware = require('http-proxy-middleware');
            Object.keys(proxyConfig).forEach((context) => {
                server.use(proxyMiddleware(context, proxyConfig[context]));
            });
        }
        // console.log(settings)
        // Default catch-all handler to allow Next.js to handle all other routes
        server.all('*', (req, res) => handle(req, res));
        // server.listen(settings.port, settings.hostname);
        server.listen(settings.port, settings.hostname, () => {
            // console.log('App server running at http://' + settings.hostname, + ':' + settings.port);
            // Enables auto registration/de-registration of app into a host in dev mode
            if (settings.dev) {
                addon.register();
            }
        });
    });
}
exports.aceServer = aceServer;
//# sourceMappingURL=default-server.js.map
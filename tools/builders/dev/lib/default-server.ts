import { BuilderContext } from '@angular-devkit/architect';
import * as express from 'express';
// https://expressjs.com/en/guide/using-middleware.html
import * as morgan from 'morgan';

// atlassian-connect-express also provides a middleware
import * as ace from 'atlassian-connect-express';
import next from 'next';
import { NextServerOptions, ProxyConfig } from '@nrwl/next';
// import { createTunnel } from './create-dev-tunnel';

/**
 * Adapted from https://github.com/zeit/next.js/blob/master/examples/with-custom-reverse-proxy/server.js
 * @param settings
 */
export async function defaultServer(
  settings: NextServerOptions,
  proxyConfig?: ProxyConfig
): Promise<void> {
  const app = next(settings);
  const handle = app.getRequestHandler();

  await app.prepare();

  const server: express.Express = express();
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
}

/**
 * Adapted from https://github.com/zeit/next.js/blob/master/examples/with-custom-reverse-proxy/server.js
 * @param settings
 */
export async function aceServer(
  settings: NextServerOptions,
  logger: any,
  proxyConfig?: ProxyConfig,
): Promise<void> {
  const app = next(settings);
  const handle = app.getRequestHandler();

  await app.prepare();

  const server: express.Express = express();

  const morganFormat: string = settings.dev ? 'dev' : 'combined';
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
    product: "jira", // Can be: 'jira', 'confluence', 'bitbucket'
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
      (addon as any).register()
    }
  });
}

/**
 * Pass Payload from express to nextjs page
 * Used for custom server / NOT for static site
 * @param req
 * @param res
 * @param next
 */
export function aceToNextPayload(req, res, next) {
  if (req.context && req.context.hostScriptUrl) {
    let payload = Object.assign({}, req.query);
    payload.hostScriptUrl = req.context.hostScriptUrl;
    req.payload = payload;
  }
  next();
}

/**
 * Use javascript file as page template
 * Workaround for atlassian-connect-express dependency on express render engines.
 * @param req
 * @param res
 * @param next
 */
export function aceEngineSetup(server) {
  server.engine('js', (path, options, callback) => {
    return callback(null, options.message);
  });
  server.set('views', './pages');
  server.set('view engine', 'js');
}

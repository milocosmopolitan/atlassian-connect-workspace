"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aceEngineSetup = exports.aceToNextPayload = void 0;
/**
 * Pass Payload from express to nextjs page
 * Used for custom server / NOT for static site
 * @param req
 * @param res
 * @param next
 */
function aceToNextPayload(req, res, next) {
    if (req.context && req.context.hostScriptUrl) {
        let payload = Object.assign({}, req.query);
        payload.hostScriptUrl = req.context.hostScriptUrl;
        req.payload = payload;
    }
    next();
}
exports.aceToNextPayload = aceToNextPayload;
/**
 * Use javascript file as page template
 * Workaround for atlassian-connect-express dependency on express render engines.
 * @param req
 * @param res
 * @param next
 */
function aceEngineSetup(server) {
    server.engine('js', (path, options, callback) => {
        return callback(null, options.message);
    });
    server.set('views', './pages');
    server.set('view engine', 'js');
}
exports.aceEngineSetup = aceEngineSetup;
//# sourceMappingURL=ace.adaptor.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTunnel = void 0;
const fs_1 = require("fs");
const path = require("path");
const ngrok = require("ngrok");
const _ = require("lodash");
const URI = require("urijs");
function createTunnel(settings, logger) {
    const credentials = fs_1.readFileSync(path.resolve(process.cwd(), 'credentials.json'), { encoding: 'UTF-8' });
    const hosts = () => {
        let value;
        try {
            value = JSON.parse(credentials);
        }
        catch (error) {
            logger.warn('Could NOT find credentials.json');
        }
        return value;
    };
    const hasRemoteHosts = _.some(hosts(), host => !/localhost/.test(host));
    if (process.env.AC_LOCAL_BASE_URL || !hasRemoteHosts) {
        return Promise.resolve();
    }
    return Promise.resolve()
        .then(() => {
        const ngrokPromise = ngrok.connect({
            proto: "http",
            addr: settings.port
        });
        if (!ngrokPromise) {
            return Promise.reject("You must update ngrok to >= 3.0");
        }
        return ngrokPromise;
    }).then(url => {
        const ltu = new URI(url);
        const lbu = new URI(`http://localhost:${settings.port}`); // TODO: make dynamic
        lbu.protocol(ltu.protocol());
        lbu.host(ltu.host());
        const tunnelURI = lbu.toString();
        logger.info(`Local tunnel established at ${tunnelURI}`);
        logger.info("Check http://127.0.0.1:4040 for tunnel status");
        // addon.emit("localtunnel_started");
        // addon.reloadDescriptor();
        return tunnelURI;
    })
        .catch(err => {
        logger.error("Failed to establish local tunnel");
        if (err.code === "MODULE_NOT_FOUND") {
            logger.error("Make sure that ngrok is installed: npm install --save-dev ngrok");
        }
        throw err && err.stack ? err : new Error(err);
    });
}
exports.createTunnel = createTunnel;
//# sourceMappingURL=create-dev-tunnel.js.map
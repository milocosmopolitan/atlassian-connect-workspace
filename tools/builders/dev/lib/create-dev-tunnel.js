"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTunnel = void 0;
const fs_1 = require("fs");
const path = require("path");
function createTunnel() {
    const credentials = fs_1.readFileSync(path.resolve(process.cwd(), 'credentials.json'), { encoding: 'UTF-8' });
    const hosts = () => {
        let value;
        try {
            value = JSON.parse(credentials);
        }
        catch (error) {
            console.warn('Could NOT find credentials.json');
        }
        console.info('Found hosts', value);
        return value;
    };
    // const hasRemoteHosts = hosts()
    // const hasRemoteHosts = _.some(hosts(), host => {
    //   return !/localhost/.test(host);
    // });
    return Promise.resolve()
        .then();
}
exports.createTunnel = createTunnel;
//# sourceMappingURL=create-dev-tunnel.js.map
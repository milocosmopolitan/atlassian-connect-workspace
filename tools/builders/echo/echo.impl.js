"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const architect_1 = require("@angular-devkit/architect");
const childProcess = require("child_process");
const rxjs_1 = require("rxjs");
exports.default = architect_1.createBuilder((_options, context) => {
    context.logger.info(`Executing "echo"...`);
    context.logger.info(`Options: ${JSON.stringify(_options, null, 2)}`);
    const child = childProcess.spawn('echo', [_options.textToEcho]);
    return new rxjs_1.Observable((observer) => {
        child.stdout.on('data', (data) => {
            context.logger.info(data.toString());
        });
        child.stderr.on('data', (data) => {
            context.logger.error(data.toString());
        });
        child.on('close', (code) => {
            context.logger.info(`Done.`);
            observer.next({ success: code === 0 });
            observer.complete();
        });
    });
});
//# sourceMappingURL=echo.impl.js.map
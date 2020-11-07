import { json } from '@angular-devkit/core';
interface Options extends json.JsonObject {
    textToEcho: string;
}
declare const _default: import("@angular-devkit/architect/src/internal").Builder<Options>;
export default _default;

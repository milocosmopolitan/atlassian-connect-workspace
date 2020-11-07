import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { NextServeBuilderOptions } from '@nrwl/next';
declare const _default: import("@angular-devkit/architect/src/internal").Builder<NextServeBuilderOptions>;
export default _default;
export declare function run(options: NextServeBuilderOptions, context: BuilderContext): Observable<BuilderOutput>;

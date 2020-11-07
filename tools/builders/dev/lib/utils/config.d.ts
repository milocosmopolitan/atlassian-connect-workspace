import { PHASE_DEVELOPMENT_SERVER, PHASE_EXPORT, PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from 'next/dist/next-server/lib/constants';
import { Configuration } from 'webpack';
import { FileReplacement, NextBuildBuilderOptions } from '@nrwl/next';
import { BuilderContext } from '@angular-devkit/architect';
export declare function createWebpackConfig(workspaceRoot: string, projectRoot: string, fileReplacements?: FileReplacement[]): (a: any, b: any) => Configuration;
export declare function prepareConfig(phase: typeof PHASE_PRODUCTION_BUILD | typeof PHASE_EXPORT | typeof PHASE_DEVELOPMENT_SERVER | typeof PHASE_PRODUCTION_SERVER, options: NextBuildBuilderOptions, context: BuilderContext): any;

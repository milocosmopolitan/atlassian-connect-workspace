/**
 * Pass Payload from express to nextjs page
 * Used for custom server / NOT for static site
 * @param req
 * @param res
 * @param next
 */
export declare function aceToNextPayload(req: any, res: any, next: any): void;
/**
 * Use javascript file as page template
 * Workaround for atlassian-connect-express dependency on express render engines.
 * @param req
 * @param res
 * @param next
 */
export declare function aceEngineSetup(server: any): void;

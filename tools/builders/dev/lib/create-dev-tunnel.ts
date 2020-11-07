import {readFileSync} from 'fs';
import * as path from 'path';
import * as ngrok from 'ngrok'


export function createTunnel(): Promise<string> {

  const credentials = readFileSync(
    path.resolve(process.cwd(), 'credentials.json'),
    { encoding: 'UTF-8' }
  );

  const hosts = () => {
    let value;
    try { value = JSON.parse(credentials) } catch (error) {
      console.warn('Could NOT find credentials.json');
    }
    console.info('Found hosts', value);
    return value;
  }

  // const hasRemoteHosts = hosts()

  // const hasRemoteHosts = _.some(hosts(), host => {
  //   return !/localhost/.test(host);
  // });

  return Promise.resolve()
    .then();
}

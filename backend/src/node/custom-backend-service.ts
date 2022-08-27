import { injectable } from '@theia/core/shared/inversify';
import { CustomBackendService } from '../common/protocol';

@injectable()
export class CustomBackendServiceImpl implements CustomBackendService {
    getEnvVariable(name: string): Promise<string> {
            let env_vars = process.env;
            if (env_vars[name] != undefined){
                // @ts-ignore
                return new Promise<string>(resolve => resolve(env_vars[name]));
            }
            throw new Error("No env variable: " + name);
    }
    checkIfPortOccupied(port: string): Promise<boolean> {
        let tcpPortUsed = require('tcp-port-used');
        let port_int: number;

        try{
            port_int = parseInt(port);
            if(port_int < 1 || port_int>65535){
                throw new Error("Port is out of bounds: "+port_int)
            }
        }
        catch(ex){
            throw new Error("This port isn't a number"+ port)
        }
       return new Promise<boolean>(resolve => resolve(tcpPortUsed.check(port_int, '127.0.0.1')))
    }

}

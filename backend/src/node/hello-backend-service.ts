import { injectable } from '@theia/core/shared/inversify';
import { HelloBackendService } from '../common/protocol';

@injectable()
export class HelloBackendServiceImpl implements HelloBackendService {
    sayHelloTo(name: string): Promise<string> {
            let vars = process.env;
            if (vars[name] != undefined){
                // @ts-ignore
                return new Promise<string>(resolve => resolve(vars[name]));
            }
            throw new Error("No env variable: " + name);
    }


    checkPort(port: string): Promise<boolean> {
        let tcpPortUsed = require('tcp-port-used');
        let port_int: number;
        console.log("receivce port"+port);
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

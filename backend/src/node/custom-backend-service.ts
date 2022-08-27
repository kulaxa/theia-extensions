import { injectable } from '@theia/core/shared/inversify';
import { CustomBackendService } from '../common/protocol';

@injectable()
export class CustomBackendServiceImpl implements CustomBackendService {

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

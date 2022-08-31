import { injectable } from '@theia/core/shared/inversify';
import { CustomBackendService } from '../common/protocol';
import {exec} from "child_process";

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


    // @ts-ignore
    resetEnvironment(hard_reset: boolean): Promise<void> {
        let command_to_execute = "pkill node";
        if(hard_reset){
            command_to_execute = "rm -rf /app/* && rm -rf /app/.* && pkill node"
        }
        exec(command_to_execute, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }

    // @ts-ignore
    execute_terminal_command(command: string): Promise<void>{
        exec(command, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }

}

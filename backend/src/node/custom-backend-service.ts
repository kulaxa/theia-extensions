import { injectable } from '@theia/core/shared/inversify';
import { CustomBackendService } from '../common/protocol';
import {exec} from "child_process";

@injectable()
export class CustomBackendServiceImpl implements CustomBackendService {

    checkIfPortOccupied(port: string): Promise<boolean> {
        let tcpPortUsed = require('tcp-port-used');
        let port_int: number;

        try {
            port_int = parseInt(port);
            if (port_int < 1 || port_int > 65535) {
                throw new Error("Port is out of bounds: " + port_int)
            }
        } catch (ex) {
            throw new Error("This port isn't a number" + port)
        }
        return new Promise<boolean>(resolve => resolve(tcpPortUsed.check(port_int, '127.0.0.1')))
    }


    resetEnvironment(hard_reset: boolean): Promise<boolean> {
        let command_to_execute = "pkill node";
        if (hard_reset) {
            command_to_execute = "rm -rf /app/* && rm -rf /app/.* || [ -z $(ls /app) ]  && cp -r /code/* /app/ && pkill node"
        }
        exec(command_to_execute, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return new Promise<boolean>(resolve => resolve(false))
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return new Promise<boolean>(resolve => resolve(true));
            }
            console.log(`stdout: ${stdout}`);
            return new Promise<boolean>(resolve => resolve(true));

        });
        return new Promise<boolean>(resolve => resolve(false));

    }

    // @ts-ignore
    execute_terminal_command(command: string): Promise<void> {
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

//
    get_from_mongo_db(query: {}, collection: string): Promise<{}> {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";

        MongoClient.connect(url, function (err: any, db: { db: (arg0: string) => any; close: () => void; }) {
            if (err) throw err;
            console.log("Trying to connect to mongo");
            var dbo = db.db("DB_TEST");
            dbo.collection("test").find({name: "tutorials point"}).toArray(function (err: any, result: any) {
                console.log("my man got an error here: " +result[0]["name"]);

                if (err) throw err;
                db.close();
                return new Promise(resolve => {
                    resolve(result)
                });


            });
        });

        throw Error("Connecting to mongo db failed");
    }
}


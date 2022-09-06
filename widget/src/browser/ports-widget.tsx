import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import {MessageService} from '@theia/core';
import {Message, OpenerService} from '@theia/core/lib/browser';

import {FileService, TextFileContent} from "@theia/filesystem/lib/browser/file-service";
import URI from "@theia/core/lib/common/uri";

import { parse } from 'yaml'

// @ts-ignore
import { CustomBackendService } from "backend/lib/common/protocol";
import {EnvVariablesServer} from "@theia/core/lib/common/env-variables";




@injectable()
export class PortsWidget extends ReactWidget {

    protected env_url: string;
    protected conf_file_content: string;

    static PATH_TO_CONFIG_FILE = "/app/config/local.config.yaml"
    static first_init: boolean = true;
    static readonly ID = 'ports:widget';
    static readonly LABEL = 'Ports Widget';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(FileService)
    protected readonly fileService!: FileService;


    @inject(CustomBackendService)
    protected readonly backendService!: CustomBackendService;


    @inject(OpenerService)
    protected readonly fileOpener!: OpenerService;

    @inject(EnvVariablesServer)
    protected readonly environments: EnvVariablesServer;


    @postConstruct()
    protected async init(): Promise <void> {
        this.id = PortsWidget.ID;
        this.title.label = PortsWidget.LABEL;
        this.title.caption = PortsWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'my-widget-tab-icon'; // example widget icon

        let tmp_env_url= await this.environments.getValue("ENV_URL");
        if(tmp_env_url && tmp_env_url.value){
            this.env_url =tmp_env_url.value.toString();
        }

        let tmp_config_file = await this.read_file(PortsWidget.PATH_TO_CONFIG_FILE, PortsWidget.first_init);
        PortsWidget.first_init = false;
        if(tmp_config_file != undefined){
            this.conf_file_content = tmp_config_file.value;
        }
        //await console.log("From widget with love: "+this.backendService.get_from_mongo_db({name: "tutorials point"}, "test"))

        this.update();}



     render(): React.ReactElement {
        console.log("Rendering ports widget");
        this.read_config_ports();

        return <div id='widget-container'>
            <h2>Services with exposed ports</h2>

            <div id='info-container'>

            </div>
            <button id='displayMessageButton' className='theia-button secondary' title='Display Message' onClick={_a => this.open_config_file(PortsWidget.PATH_TO_CONFIG_FILE)}>Open config</button>
            <button id='updateButton' className='theia-button secondary' title='Update' onClick={_a => this.init()}>Update</button>

        </div>
    }


    protected read_config_ports(): void {
        if(this.conf_file_content != undefined) {
            let yaml_object = parse(this.conf_file_content);

            const portDiv = document.createElement("div");
            if (yaml_object != undefined) {
                console.log("trying to read ports from config file");
                if (yaml_object.services != undefined) {
                    for (let [key, value] of Object.entries<any>(yaml_object.services)) {

                        if (value.port === undefined) {
                            continue;
                        }
                        console.log("read " + key + ":" + value.port + " from config file");
                        this.backendService.checkIfPortOccupied(value.port).then((result: boolean) => {
                            console.log("Reading port for service: " + key + " and port is : " + result);
                            if (result) {
                                const newContent = document.createTextNode(key + ": \n");
                                const link = document.createElement("a");
                                link.text = value.port + "." + this.env_url;
                                link.setAttribute("href", "http://" + link.text);
                                link.setAttribute("target", "blank");
                                const subPortDiv = document.createElement("div");

                                subPortDiv.id = "port-container";
                                subPortDiv.appendChild(newContent);
                                subPortDiv.appendChild(link);
                                portDiv.appendChild(subPortDiv);
                            }

                            let div = document.getElementById("info-container");
                            if (div != null) {
                                if (div.childNodes.length == 0) {
                                    div.appendChild(portDiv);
                                } else {

                                    for (let i = 0; i < div.childNodes.length; i++) {
                                        div.removeChild(div.childNodes.item(i));
                                    }
                                    div.appendChild(portDiv);
                                }
                            }
                        })


                    }
                }

            }
        }
    }


    protected open_config_file(file_path: string): void {
        this.messageService.info('Opening: '+file_path);

        this.fileOpener.getOpener(new URI(file_path)).then(opener =>{
            opener.open(new URI(file_path));
        });

    }


    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        let htmlElement = document.getElementById("displayMessageButton");
        if (htmlElement) {
            htmlElement.focus();
        }



    }


    protected async read_file(config_file: string, on_init: boolean) : Promise<TextFileContent | undefined>{
        let path = new URI(config_file);
        if (!(await this.fileService.exists(path))) {
            console.log("Resource does not exist");
            if(!on_init) {
                this.messageService.error("Can't read " + config_file + " because it doesn't exist!");
            }
            return undefined
        } else {
            console.log("Reading file:" + path.toString());
            return await this.fileService.read(path);
        }
    }

    set_path_to_config_file(config_file: string): void{
        PortsWidget.PATH_TO_CONFIG_FILE=config_file;
    }

}

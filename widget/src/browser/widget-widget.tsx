import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import {MessageService} from '@theia/core';
import {Message, OpenerService} from '@theia/core/lib/browser';

import {FileService} from "@theia/filesystem/lib/browser/file-service";
import URI from "@theia/core/lib/common/uri";

import { parse } from 'yaml'

// @ts-ignore
import { HelloBackendService } from "backend/lib/common/protocol";



@injectable()
export class WidgetWidget extends ReactWidget {

    static readonly ID = 'widget:widget';
    static readonly LABEL = 'Widget Widget';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(FileService)
    protected readonly fileService!: FileService;


    @inject(HelloBackendService)
    protected readonly backendService!: HelloBackendService;


    @inject(OpenerService)
    protected readonly fileOpener!: OpenerService;


    @postConstruct()
    protected async init(): Promise <void> {
        this.id = WidgetWidget.ID;
        this.title.label = WidgetWidget.LABEL;
        this.title.caption = WidgetWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon
        this.update();}



     render(): React.ReactElement {
        let file:  string = "/app/config/config.yaml";
        this.read_config_ports(file);

        return <div id='widget-container'>
            <h2>Services with exposed ports</h2>

            <div id='info-container'>

            </div>
            <button id='displayMessageButton' className='theia-button secondary' title='Display Message' onClick={_a => this.open_config_file(file)}>Open config</button>
            <button id='updateButton' className='theia-button secondary' title='Update' onClick={_a => this.read_config_ports(file)}>Update</button>

        </div>
    }


    protected read_config_ports(file: string): void {

        let path = new URI(file);
        if (!( this.fileService.exists(path))) {
            console.log("Resource does not exist");
            this.messageService.error("can't read file because it doesn't exists");
            return
        } else {
            console.log("Reading file:" + path.toString());
        }
        let env_host = "";
        this.backendService.sayHelloTo("ENV_URL").then((result: any) =>{
            console.log(result);
            env_host = result;
        });
        let this_current = this;
        this.fileService.read(path).then(function(result){
            let file_content = result.value.toString();
            let yaml_object = parse(file_content);

            const portDiv = document.createElement("div");
            console.log("Reading config file");
            if(yaml_object){
                for(let [key, value] of Object.entries<any>(yaml_object.services)){
                    if (value.port === undefined){
                        continue;
                    }
                    this_current.backendService.checkPort(value.port).then((result:boolean) =>{
                        console.log("Reading port for service: "+key+ " and port is : "+ result);
                        if(result){
                            const newContent = document.createTextNode(key + ": \n");
                            const link = document.createElement("a");
                            link.text = value.port+"."+env_host;
                            link.setAttribute("href","http://"+ link.text);
                            link.setAttribute("target", "blank");
                            const subPortDiv = document.createElement("div");

                            subPortDiv.id = "port-container";
                            subPortDiv.appendChild(newContent);
                            subPortDiv.appendChild(link);
                            portDiv.appendChild(subPortDiv);
                        }

                        let div = document.getElementById("info-container");
                        if(div != null) {
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

        } );

    }


    protected open_config_file(file_path: string): void {
        this.messageService.info('Opening config.yaml');

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

}

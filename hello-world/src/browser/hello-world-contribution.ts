import { injectable, inject } from '@theia/core/shared/inversify';
import {
    Command,
    CommandContribution,
    CommandRegistry, MAIN_MENU_BAR,
    MenuContribution,
    MenuModelRegistry,

} from '@theia/core/lib/common';


import {FileService} from "@theia/filesystem/lib/browser/file-service";
// import URI from "@theia/core/lib/common/uri";
import {FileDialogService, SaveFileDialogProps} from "@theia/filesystem/lib/browser";
import {TerminalService} from "@theia/terminal/lib/browser/base/terminal-service";


export const HelloWorldCommand: Command = {
    id: 'HelloWorld.command',
    label: 'Say Hello'
};

@injectable()
export class HelloWorldCommandContribution implements CommandContribution {

    constructor(
        @inject(FileService) private readonly fileService: FileService,
        @inject(FileDialogService) private readonly dialog: FileDialogService,
        @inject(TerminalService) private readonly terminalService: TerminalService
    ) { }

    registerCommands(registry: CommandRegistry): void {

        registry.registerCommand(HelloWorldCommand, {
            execute: async () => {



                let props = new SaveFileDialogProps();

                let path= await this.dialog.showSaveDialog(props );
                if (path === undefined){
                    throw new Error();
                }
                console.log(path);

                // const fileUrl: URI = new URI(
                //     path
                // );

                console.log("This is readJsonFile method");

                if (!(await this.fileService.exists(path))) {
                    console.log("Resource does not exist");
                    this.fileService.createFile(path);
                } else {
                    console.log("Resource exists");
                }

                const fileContent = await this.fileService.read(path);
                console.log("Filecontent read: " + fileContent.value);

                let terminal_new = await this.terminalService.newTerminal({});
                this.terminalService.open(terminal_new, {});

                await terminal_new.start(this.terminalService.all.length);
                terminal_new.sendText("forge run\n");

            }





        });
    }
}

@injectable()
export class HelloWorldMenuContribution implements MenuContribution {
    private TEST_MENU = [...MAIN_MENU_BAR, 'zzzz'];
    registerMenus(menus: MenuModelRegistry): void {

        menus.registerSubmenu(this.TEST_MENU, "Hello World", );

        menus.registerMenuAction(this.TEST_MENU, {
            commandId: HelloWorldCommand.id,
            label: HelloWorldCommand.label
        });
    }


}

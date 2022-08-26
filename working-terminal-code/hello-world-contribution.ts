import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core/lib/common';
import {TerminalService} from "@theia/terminal/lib/browser/base/terminal-service";
import {CommonMenus} from "@theia/core/lib/browser";

export const HelloWorldCommand: Command = {
    id: 'HelloWorld.command',
    label: 'Say Hello'
};

@injectable()
export class HelloWorldCommandContribution implements CommandContribution {

    constructor(
        @inject(TerminalService) private readonly terminalService: TerminalService,
    ) { }

    registerCommands(registry: CommandRegistry): void {

        registry.registerCommand(HelloWorldCommand, {
            execute: async () => {
                let terminal_new = await this.terminalService.newTerminal({});
                this.terminalService.open(terminal_new, {});

                await terminal_new.start(this.terminalService.all.length);
                terminal_new.sendText("pwd\n");

                }

        });
    }
}

@injectable()
export class HelloWorldMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: HelloWorldCommand.id,
            label: HelloWorldCommand.label
        });
    }
}

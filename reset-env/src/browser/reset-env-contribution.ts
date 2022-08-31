import { injectable, inject } from '@theia/core/shared/inversify';
import {
    Command,
    CommandContribution,
    CommandRegistry, MAIN_MENU_BAR,
    MenuContribution,
    MenuModelRegistry, MessageService
} from '@theia/core/lib/common';

// @ts-ignore
import { CustomBackendService } from "backend/lib/common/protocol";
import {ConfirmDialog} from "@theia/core/lib/browser";

export const SoftResetEnvCommand: Command = {
    id: 'SoftRestEnvCommand.command',
    label: 'Soft Reset Environment'
};

export const HardResetEnvCommand: Command = {
    id: 'HardRestEnvCommand.command',
    label: 'Hard Reset Environment'
};




@injectable()
export class SoftResetEnvCommandContribution implements CommandContribution {
    constructor(
    ) { }

    @inject(CustomBackendService)
    protected readonly backendService!: CustomBackendService;

    @inject(MessageService)
    protected readonly messageService:MessageService;

    registerCommands(registry: CommandRegistry): void {

        registry.registerCommand(SoftResetEnvCommand, {
            execute:  () => {
                new ConfirmDialog({
                    title: 'Soft Reset Environment',
                    msg: `Do you really want to reset the environment? Everything except your /app directory will be deleted!`
                }).open().then(result =>{
                    if(result){
                        console.log("Resetting environment");
                        this.messageService.info("Resetting just environment, not /app")
                        this.backendService.resetEnvironment(false);
                    }
                    else{
                        console.log("NONONOOOO"+ result)
                    }
                });
            }
        });
    }
}
@injectable()
export class HardResetEnvCommandContribution implements CommandContribution {
    constructor(
    ) { }

    @inject(CustomBackendService)
    protected readonly backendService!: CustomBackendService;

    @inject(MessageService)
    protected readonly messageService:MessageService;


    registerCommands(registry: CommandRegistry): void {

    registry.registerCommand(HardResetEnvCommand, {
        execute:  () => {
            new ConfirmDialog({
                title: 'Reset Environment',
                msg: `Do you really want to reset the environment? Everything INCLUDING your /app directory will be deleted!`
            }).open().then(result =>{
                if(result){
                    console.log("Resetting environment");
                    this.messageService.info("Resetting environment including /app!");
                    this.backendService.resetEnvironment(true);
                }
                else{
                    console.log("Not resetting the environment");
                }
            });
        }
    });
}
}

@injectable()
export class SoftResetEnvMenuContribution implements MenuContribution {
    private TEST_MENU = [...MAIN_MENU_BAR, 'zzzz'];
    registerMenus(menus: MenuModelRegistry): void {
        menus.registerSubmenu(this.TEST_MENU, "Reset Environment", );
        menus.registerMenuAction(this.TEST_MENU, {
            commandId: SoftResetEnvCommand.id,
            label: SoftResetEnvCommand.label
        }
        );
    }

}

@injectable()
export class HardResetEnvMenuContribution implements MenuContribution {
    private TEST_MENU = [...MAIN_MENU_BAR, 'zzzz'];
    registerMenus(menus: MenuModelRegistry): void {
        menus.registerSubmenu(this.TEST_MENU, "Reset Environment", );
        menus.registerMenuAction(this.TEST_MENU, {
                commandId: HardResetEnvCommand.id,
                label: HardResetEnvCommand.label
            }
        );
    }

}


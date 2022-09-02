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
    label: 'Soft Reset'
};

export const HardResetEnvCommand: Command = {
    id: 'HardRestEnvCommand.command',
    label: 'Hard Reset'
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
            execute: async  () => {
                let result = await new ConfirmDialog({
                    title: 'Soft Reset',
                    msg: `Do you really want to reset the environment? Every process will be killed!`
                }).open()
                if(result) {
                    this.messageService.info("Your environment is begin reset. Killing all processes...")
                    let reset_result = await this.backendService.resetEnvironment(false);
                    if (!reset_result) {
                        this.messageService.error("Something went wrong with resetting your environment! Try again.")
                    }
                }
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
        execute: async  () => {
            let result = await new ConfirmDialog({
                title: 'Hard Reset',
                msg: `Do you really want to HARD reset the environment? Every process and file will be deleted! This cannot be undone!`
            }).open();
            if(result) {
                console.log("Resetting environment");
                this.messageService.info("You environment is begin reset. Killing all processes and deleting all files...");
                let reset_result = await this.backendService.resetEnvironment(true)
                if (!reset_result) {
                    this.messageService.error("Files from /app can't be deleted! You can delete them manually and try again.");
                }

            }



        }
    });
}
}

@injectable()
export class SoftResetEnvMenuContribution implements MenuContribution {
    private TEST_MENU = [...MAIN_MENU_BAR, 'zzzz'];
    registerMenus(menus: MenuModelRegistry): void {
        menus.registerSubmenu(this.TEST_MENU, "Environment", );
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
        menus.registerSubmenu(this.TEST_MENU, "Environment", );
        menus.registerMenuAction(this.TEST_MENU, {
                commandId: HardResetEnvCommand.id,
                label: HardResetEnvCommand.label
            }
        );
    }

}


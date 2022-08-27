import {inject, injectable} from '@theia/core/shared/inversify';
import {CommandService, MenuModelRegistry} from '@theia/core';
import { PortsWidget } from './ports-widget';
import {
    AbstractViewContribution,
    FrontendApplication,
    FrontendApplicationContribution,
    WidgetManager
} from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';
import {FrontendApplicationStateService} from "@theia/core/lib/browser/frontend-application-state";

export const WidgetCommand: Command = { id: 'widget:command' };

@injectable()
export class WidgetContribution extends AbstractViewContribution<PortsWidget> implements FrontendApplicationContribution{

    /**
     * `AbstractViewContribution` handles the creation and registering
     *  of the widget including commands, menus, and keybindings.
     * 
     * We can pass `defaultWidgetOptions` which define widget properties such as 
     * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
     * 
     */
    constructor() {
        super({
            widgetId: PortsWidget.ID,
            widgetName: PortsWidget.LABEL,
            defaultWidgetOptions: { area: 'left' },
            toggleCommandId: WidgetCommand.id
        });
    }

    /**
     * Example command registration to open the widget from the menu, and quick-open.
     * For a simpler use case, it is possible to simply call:
     ```ts
     super.registerCommands(commands)
     ```
     *
     * For more flexibility, we can pass `OpenViewArguments` which define
     * options on how to handle opening the widget:
     *
     ```ts
     toggle?: boolean
     activate?: boolean;
     reveal?: boolean;
     ```
     *
     * @param WidgetContribution
     */


    @inject(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    @inject(CommandService)
    protected readonly commandService: CommandService

    @inject(WidgetManager)
    protected readonly widgetManger: WidgetManager

    async onStart(app: FrontendApplication): Promise<void> {
        // open file explorer and attach ports widget
        this.stateService.reachedState('ready').then(
            () => {
                this.widgetManger.getWidget("files").then((navigator) =>{
                    if(navigator == undefined) {
                        console.log("navigator doesn't exists, runnig command");
                        this.commandService.executeCommand("fileNavigator:toggle").then(() => {
                            this.openView({reveal: false})

                        })
                    }
                })



            }
                )




    }
    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(WidgetCommand, {
            execute: () => {super.openView({ activate: false, reveal: true })
            }
        });
    }

    /**
     * Example menu registration to contribute a menu item used to open the widget.
     * Default location when extending the `AbstractViewContribution` is the `View` main-menu item.
     * 
     * We can however define new menu path locations in the following way:
     ```ts
        menus.registerMenuAction(CommonMenus.HELP, {
            commandId: 'id',
            label: 'label'
        });
     ```
     * 
     * @param menus
     */
    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}


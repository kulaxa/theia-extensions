import {inject, injectable} from '@theia/core/shared/inversify';
import {CommandService, MenuModelRegistry} from '@theia/core';
import { PortsWidget } from './ports-widget';
import {
    AbstractViewContribution,
    FrontendApplication,
    FrontendApplicationContribution, OpenerService,
    WidgetManager
} from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';
import {FrontendApplicationStateService} from "@theia/core/lib/browser/frontend-application-state";
import URI from "@theia/core/lib/common/uri";
// import URI from "@theia/core/lib/common/uri";

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


    @inject(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    @inject(CommandService)
    protected readonly commandService: CommandService

    @inject(WidgetManager)
    protected readonly widgetManger: WidgetManager

    @inject(OpenerService)
    protected readonly fileOpener!: OpenerService;

    async onStart(app: FrontendApplication): Promise<void> {
    //     // open file explorer and attach ports widget
         this.stateService.reachedState('ready').then(
            () => {
                super.openView({ toggle:true});
                this.fileOpener.getOpener(
                    new URI("/app/README.md")).then(opener => {
                        opener.open(new URI("/app/README.md"));
                    });
            })
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(WidgetCommand, {
            execute: () => {super.openView({ activate: false, reveal: true })
            }
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}


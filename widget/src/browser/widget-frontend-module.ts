import { ContainerModule } from '@theia/core/shared/inversify';
import { PortsWidget } from './ports-widget';
import {SetConfigFilePortsContribution, WidgetContribution} from './widget-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';
import {CommandContribution} from "@theia/core";

export default new ContainerModule(bind => {
    bindViewContribution(bind, WidgetContribution);
    bind(FrontendApplicationContribution).toService(WidgetContribution);
    bind(CommandContribution).to(SetConfigFilePortsContribution);
    bind(PortsWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: PortsWidget.ID,
        createWidget: () => ctx.container.get<PortsWidget>(PortsWidget)
    })).inSingletonScope();
});

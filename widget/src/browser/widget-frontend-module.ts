import { ContainerModule } from '@theia/core/shared/inversify';
import { PortsWidget } from './ports-widget';
import { WidgetContribution } from './widget-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, WidgetContribution);
    bind(FrontendApplicationContribution).toService(WidgetContribution);
    bind(PortsWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: PortsWidget.ID,
        createWidget: () => ctx.container.get<PortsWidget>(PortsWidget)
    })).inSingletonScope();
});

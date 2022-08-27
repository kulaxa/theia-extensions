
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { ContainerModule } from '@theia/core/shared/inversify';
import {  CustomBackendService, CUSTOM_BACKEND_PATH } from '../common/protocol';

export default new ContainerModule(bind => {
    bind(CustomBackendService).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<CustomBackendService>(CUSTOM_BACKEND_PATH);
    }).inSingletonScope();

})



import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core';
import { ContainerModule } from '@theia/core/shared/inversify';
import { CustomBackendServiceImpl } from './custom-backend-service';
import { CustomBackendService, CUSTOM_BACKEND_PATH} from '../common/protocol'

export default new ContainerModule(bind => {
    bind(CustomBackendService).to(CustomBackendServiceImpl).inSingletonScope()
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(CUSTOM_BACKEND_PATH, () => {
            return ctx.container.get<CustomBackendService>(CustomBackendService);
        })
    ).inSingletonScope()
});

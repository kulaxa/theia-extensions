import {HardResetEnvCommandContribution, SoftResetEnvCommandContribution, SoftResetEnvMenuContribution} from './reset-env-contribution';
import {CommandContribution, MenuContribution} from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(HardResetEnvCommandContribution);
    bind(CommandContribution).to(SoftResetEnvCommandContribution);
    // bind(MenuContribution).to(HardResetEnvMenuContribution);
    bind(MenuContribution).to(SoftResetEnvMenuContribution);
});

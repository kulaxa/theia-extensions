export const CustomBackendService = Symbol('CustomBackendService');
export const CUSTOM_BACKEND_PATH = '/services/helloBackend';

export interface CustomBackendService {
    checkIfPortOccupied(port: string): Promise<boolean>
    resetEnvironment(hard_reset: boolean): boolean
    execute_terminal_command(command: string): Promise<void>
    get_from_mongo_db(query: {}, collection: string): Promise<{}>

}
export const BackendClient = Symbol('BackendClient');
export interface BackendClient {
    getName(): Promise<string>;
}

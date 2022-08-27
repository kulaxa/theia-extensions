export const CustomBackendService = Symbol('CustomBackendService');
export const CUSTOM_BACKEND_PATH = '/services/helloBackend';

export interface CustomBackendService {
    checkIfPortOccupied(port: string): Promise<boolean>
}
export const BackendClient = Symbol('BackendClient');
export interface BackendClient {
    getName(): Promise<string>;
}

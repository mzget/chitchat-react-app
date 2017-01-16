export interface ISecureService {
    encryption(content): Promise<string>;
    decryption(content): Promise<string>;
}
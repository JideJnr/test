import * as CryptoJS from "crypto-js";

export default class EncryptionService {
  private static secretKey: string = "mySecretKey"; // Replace with your own secret key

  static encrypt(value: string): string | null {
    try {
      const encryptedValue = CryptoJS.AES.encrypt(
        value,
        EncryptionService.secretKey
      ).toString();

      return encryptedValue;
    } catch (error) {
      return null;
    }
  }

  static decrypt(value: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(value, EncryptionService.secretKey);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);

      return decryptedValue;
    } catch (error) {
      return null;
    }
  }
}

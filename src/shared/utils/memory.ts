import EncryptionService from "@/shared/utils/e2eService";

export default class MemoryService {
  constructor() {}

  static save(value: any, key: string): boolean {
    try {
      window.localStorage.setItem(`ibl_${key}`, value);

      return true;
    } catch (error) {
      return false;
    }
  }

  static get(key: string): any {
    const res = window.localStorage.getItem(`ibl_${key}`);

    return res;
  }

  static encryptAndSave(value: any, key: string): void {
    try {
      const val = EncryptionService.encrypt(parseJsonToString(value));

      if (val) {
        window.localStorage.setItem(`ibl_enc_${key}`, val);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static decryptAndGet(key: string): string | object | null | any {
    const res = window.localStorage.getItem(`ibl_enc_${key}`);

    if (res) {
      return parseStringToJson(EncryptionService.decrypt(res));
    }

    return null;
  }

  static remove(key: string, encrypted?: boolean): boolean {
    try {
      window.localStorage.removeItem(`ibl_${encrypted ? "enc_" : ""}${key}`);
    } catch (error) {
      return false;
    }
  }

  static clear(): boolean {
    try {
      window.localStorage.clear();

      return true;
    } catch (error) {
      return false;
    }
  }
}

function parseJsonToString(value: any): string {
  try {
    JSON.parse(JSON.stringify(value));
  } catch (e) {
    return value.toString();
  }

  return JSON.stringify(value);
}

function parseStringToJson(value: string): any {
  let parsedValue;

  try {
    parsedValue = JSON.parse(value);
  } catch (e) {
    return value;
  }

  return parsedValue;
}

import { HttpBadRequest } from "./http_error_handler";

export const HttpParamValidators = {
  /**
   * @param {string} key 
   * @param {number} min 
   * @param {number} max 
   */
  MustBeString(obj, key, min = 1, max = 512) {
      const v = obj[key];
      if (typeof v !== 'string') {
          throw HttpBadRequest(`${key} must be string`);
      }
      if (v.length < min) {
          throw HttpBadRequest(`${key} must be at least ${min} characters`);
      }
      if (v.length > max) {
          throw HttpBadRequest(`${key} must be shorter than ${max} characters`);
      }
      return v;
  },
  /**
   * @param {string} key 
   * @param {Array} values 
   * @returns 
   */
  MustBeOneOf(obj, key, values = []) {
      const value = obj[key];
      for (const v of values) {
          if (v === value) {
              return v;
          }
      }
      throw HttpBadRequest(`${key} must be one of ${values.join(',')}`);
  },
}
// utils/unflattenConfig.ts
export function unflattenConfig(config: Record<string, any>): any {
  const result: Record<string, any> = {};

  Object.entries(config).forEach(([key, value]) => {
    const keys = key.split(".");
    let curr = result;

    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        // last part of the key
        curr[k] = value;
      } else {
        // intermediate object
        curr[k] = curr[k] || {};
        curr = curr[k];
      }
    });
  });

  return result;
}
export function normalizeConfig(config: any): any {
  const copy = structuredClone(config || {});



  // Fix array-typed fields
  if (copy.anonymization) {
    const anon = copy.anonymization;
    if (typeof anon.pseudonymization === "string") {
      anon.pseudonymization = anon.pseudonymization
        ? [anon.pseudonymization]
        : [];
    }
    if (typeof anon.suppression === "string") {
      anon.suppression = anon.suppression ? [anon.suppression] : [];
    }
  }

  return copy;
}

export function flattenConfig(obj: any, prefix = "", res: any = {}): any {
  if (typeof obj !== "object" || obj === null) return res;

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const val = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof val === "object" && !Array.isArray(val) && val !== null) {
      flattenConfig(val, newKey, res);
    } else {
      res[newKey] = val;
    }
  }

  return res;
}

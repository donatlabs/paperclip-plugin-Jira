import { describe, expect, it } from "vitest";
import manifest from "../src/manifest.js";

// The host binds a secret as {type:"secret_ref", secretId, version} and the
// SDK resolves either that or the secret's UUID. A schema that demands a
// string makes the host refuse the config a platform writes, which is how
// this was found: "/apiTokenRef must be string".
describe("secret references in the manifest", () => {
  const props = (manifest.instanceConfigSchema as {
    properties: Record<string, { type?: string | string[]; format?: string }>;
  }).properties;

  it.each(["oauthClientSecretRef", "oauthRefreshTokenRef", "apiTokenRef", "webhookSecretRef"])(
    "%s takes the host's binding as well as a UUID",
    (field) => {
      expect(props[field]?.type).toEqual(["string", "object"]);
      expect(props[field]?.format).toBe("secret-ref");
    },
  );
});

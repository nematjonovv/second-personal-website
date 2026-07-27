import type { OpenAPIV3_1 } from "openapi-types";

export type Schema = OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject;
export type Schemas = Record<string, OpenAPIV3_1.SchemaObject>;

export type Paths = Record<string, Partial<Record<OpenAPIV3_1.HttpMethods, Operation>>>;
export type Operation = OpenAPIV3_1.OperationObject;

export type ModuleDocs = { schemas?: Schemas; paths: Paths };

export const ref = (name: string): OpenAPIV3_1.ReferenceObject => ({
  $ref: `#/components/schemas/${name}`,
});

export const success = (description: string, data?: Schema): OpenAPIV3_1.ResponseObject => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: { type: "boolean", examples: [true] },
          message: { type: "string" },
          data: data ?? { type: "null" },
        },
      },
    },
  },
});

export type ErrorName =
  | "BadRequest"
  | "Unauthorized"
  | "NotFound"
  | "Conflict"
  | "PayloadTooLarge"
  | "ServerError";

export const errors = (...names: ErrorName[]): Record<string, OpenAPIV3_1.ReferenceObject> =>
  Object.fromEntries(
    names.map((name) => [ERROR_STATUS[name], { $ref: `#/components/responses/${name}` }]),
  );

export const ERROR_STATUS: Record<ErrorName, string> = {
  BadRequest: "400",
  Unauthorized: "401",
  NotFound: "404",
  Conflict: "409",
  PayloadTooLarge: "413",
  ServerError: "500",
};

export const secured = [{ bearerAuth: [] }];

export const localized = (schema: Schema): OpenAPIV3_1.SchemaObject => ({
  type: "object",
  required: ["uz", "en"],
  properties: { uz: schema, en: schema },
});

export const slugParam = (
  name = "slug",
  description = "Yozuvning slug'i",
): OpenAPIV3_1.ParameterObject => ({
  name,
  in: "path",
  required: true,
  description,
  schema: { type: "string" },
});

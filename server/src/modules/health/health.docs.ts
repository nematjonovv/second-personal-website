import { errors, success, type ModuleDocs } from "../../shared/openapi";

export const healthDocs: ModuleDocs = {
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Server tirikligini tekshirish",
        responses: {
          200: success("Server up"),
          ...errors("ServerError"),
        },
      },
    },
  },
};

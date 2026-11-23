import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";
import { OpenAPI } from "../lib/auth";

export const openApiPlugin = new Elysia({ name: "openapi-plugin" }).use(
  openapi({
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths(),
      info: {
        title: "Qanvas API Documentation",
        version: "1.0.0",
      },
      tags: [
        {
          name: "Example",
          description: "Exmaple description",
        },
      ],
    },

    path: "/docs",
  }),
);

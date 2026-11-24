import Elysia from "elysia";
import { authGuard } from "../../plugins/auth-guard";
import { updateWorkspaceSchema, workspaceSchema } from "./model";
import { workspaceService } from "./service";

export const workspaceModule = new Elysia({
  prefix: "/workspaces",
  tags: ["Workspaces"],
})
  .use(authGuard)

  // WORKSPACES
  .get(
    "",
    async ({ user, set }) => {
      const workspaces = await workspaceService.getAll(user.id);

      set.status = 200;

      return workspaces;
    },
    { auth: true },
  )
  .get(
    "/:id",
    async ({ params: { id }, user, set }) => {
      const workspace = await workspaceService.getById(id, user.id);

      set.status = 200;

      return workspace;
    },
    { auth: true },
  )
  .post(
    "",
    async ({ body, user, set }) => {
      const workspace = await workspaceService.create(body, user.id);

      set.status = 201;

      return workspace;
    },
    { auth: true, body: workspaceSchema },
  )
  .patch(
    "/:id",
    async ({ body, params: { id }, user, set }) => {
      const workspace = await workspaceService.update(body, id, user.id);

      set.status = 200;

      return workspace;
    },
    {
      auth: true,
      body: updateWorkspaceSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, user, set }) => {
      const res = await workspaceService.delete(id, user.id);

      set.status = 200;

      return res;
    },
    { auth: true },
  )

  // WORKSPACE MEMBERS
  .get("/:id/members", async () => {})
  .post("/:id/members", async () => {})
  .patch("/:id/members/:userId", async () => {})
  .delete("/:id/members/:userId", async () => {});

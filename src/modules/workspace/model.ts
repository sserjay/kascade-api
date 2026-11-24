import { Static, t } from "elysia";

export const workspaceSchema = t.Object({
  name: t.String({
    minLength: 1,
    maxLength: 64,
  }),
  description: t.Optional(
    t.String({
      maxLength: 500,
    }),
  ),
});

export const updateWorkspaceSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 64 })),
  description: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
});

export type WorkspaceBody = Static<typeof workspaceSchema>;
export type UpdateWorkspaceBody = Static<typeof updateWorkspaceSchema>;

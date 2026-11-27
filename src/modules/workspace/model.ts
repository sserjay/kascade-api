import { Static, t } from "elysia";

export const workspaceSchema = t.Object({
  name: t.String({
    minLength: 1,
    maxLength: 50,
  }),
  description: t.Optional(
    t.String({
      maxLength: 500,
    }),
  ),
});

export const updateWorkspaceSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 50 })),
  description: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
});

export const memberSchema = t.Object({
  email: t.String({
    minLength: 1,
    maxLength: 255,
    format: "email",
  }),

  role: t.Union([t.Literal("ADMIN"), t.Literal("MEMBER"), t.Literal("CLIENT")]),
});

export const updateMemberSchema = t.Object({
  role: t.Union([t.Literal("ADMIN"), t.Literal("MEMBER"), t.Literal("CLIENT")]),
});

export type WorkspaceBody = Static<typeof workspaceSchema>;
export type UpdateWorkspaceBody = Static<typeof updateWorkspaceSchema>;

export type MemberBody = Static<typeof memberSchema>;
export type UpdateMemberBody = Static<typeof updateMemberSchema>;

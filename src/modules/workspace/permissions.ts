import { workspaceRepository } from "./repository";

type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "CLIENT";

export const getWorkspaceAccess = async (
  workspaceId: string,
  userId: string,
) => {
  const workspace = await workspaceRepository.findWorkspaceById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (workspace.ownerId === userId) {
    return {
      workspace,
      role: "OWNER" as WorkspaceRole,
    };
  }

  const membership = await workspaceRepository.findWorkspaceMember(
    workspaceId,
    userId,
  );

  if (!membership) {
    throw new Error("Access denied");
  }

  return {
    workspace,
    role: membership.role as WorkspaceRole,
  };
};

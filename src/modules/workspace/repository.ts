import { prisma } from "../../lib/prisma";
import type { UpdateWorkspaceBody, WorkspaceBody } from "./model";

export const workspaceRepository = {
  // WORKSPACES
  findWorkspaceById: (workspaceId: string) => {
    return prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });
  },

  findOwnedWorkspacesByUserId: (userId: string) => {
    return prisma.workspace.findMany({
      where: {
        ownerId: userId,
      },
    });
  },

  findJoinedWorkspacesByUserId: (userId: string) => {
    return prisma.workspaceMember.findMany({
      where: {
        userId,
      },
      include: { workspace: true },
    });
  },

  findWorkspaceMember: (workspaceId: string, userId: string) => {
    return prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  },

  create: (data: WorkspaceBody, slug: string, userId: string) => {
    return prisma.workspace.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        ownerId: userId,
      },
    });
  },

  update: (data: UpdateWorkspaceBody, slug: string, workspaceId: string) => {
    return prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        ...data,
        slug,
      },
    });
  },

  delete: (workspaceId: string) => {
    return prisma.workspace.delete({
      where: { id: workspaceId },
    });
  },

  // WORKSPACE MEMBERS
};

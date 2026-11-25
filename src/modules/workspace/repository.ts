import { WorkspaceMemberRole } from "../../generated/prisma/enums";
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
  findAllMembers: (workspaceId: string) => {
    return prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
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

  findUserByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  createMember: (
    workspaceId: string,
    userId: string,
    role: WorkspaceMemberRole,
  ) => {
    return prisma.workspaceMember.create({
      data: {
        userId,
        workspaceId,
        role,
      },
    });
  },

  updateMember: (
    workspaceId: string,
    userId: string,
    role: WorkspaceMemberRole,
  ) => {
    return prisma.workspaceMember.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: { role },
    });
  },

  deleteMember: (workspaceId: string, userId: string) => {
    return prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  },
};

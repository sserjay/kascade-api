import slugify from "slugify";
import { prisma } from "../../lib/prisma";
import type { UpdateWorkspaceBody, WorkspaceBody } from "./model";
import { workspaceRepository } from "./repository";
import { getWorkspaceAccess } from "./permissions";

export const workspaceService = {
  // WORKSPACES
  createWorkspaceAfterSignUp: async (userId: string) => {
    const name = "Personal";

    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    return prisma.workspace.create({
      data: {
        name,
        slug,
        ownerId: userId,
      },
    });
  },

  getAll: async (userId: string) => {
    const [owned, joined] = await Promise.all([
      workspaceRepository.findOwnedWorkspacesByUserId(userId),
      workspaceRepository.findJoinedWorkspacesByUserId(userId),
    ]);

    return {
      owned,
      joined: joined.map((member) => ({
        workspace: member.workspace,
        role: member.role,
      })),
    };
  },

  getById: async (workspaceId: string, userId: string) => {
    const { workspace, role } = await getWorkspaceAccess(workspaceId, userId);

    return {
      workspace,
      role,
    };
  },

  create: async (data: WorkspaceBody, userId: string) => {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    return workspaceRepository.create(data, slug, userId);
  },

  update: async (
    data: UpdateWorkspaceBody,
    workspaceId: string,
    userId: string,
  ) => {
    const { workspace, role } = await getWorkspaceAccess(workspaceId, userId);

    if (role !== "OWNER" && role !== "ADMIN") {
      throw new Error("You cannot update this workspace");
    }

    const slug = data.name
      ? slugify(data.name, {
          lower: true,
          strict: true,
        })
      : workspace.slug;

    return workspaceRepository.update(data, slug, workspaceId);
  },

  delete: async (workspaceId: string, userId: string) => {
    const { role } = await getWorkspaceAccess(workspaceId, userId);

    if (role !== "OWNER") {
      throw new Error("You cannot delete this workspace");
    }

    await workspaceRepository.delete(workspaceId);

    return {
      message: "Workspace deleted successfully",
    };
  },

  // WORKSPACE MEMBERS
};

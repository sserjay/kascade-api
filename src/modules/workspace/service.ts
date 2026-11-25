import slugify from "slugify";
import { prisma } from "../../lib/prisma";
import type {
  MemberBody,
  UpdateMemberBody,
  UpdateWorkspaceBody,
  WorkspaceBody,
} from "./model";
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
  getAllMembers: async (workspaceId: string, userId: string) => {
    await getWorkspaceAccess(workspaceId, userId);

    const workspace = await workspaceRepository.findAllMembers(workspaceId);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    return [
      {
        user: workspace.owner,
        role: "OWNER",
      },
      ...workspace.members.map((member) => ({
        user: member.user,
        role: member.role,
      })),
    ];
  },

  addMember: async (
    body: MemberBody,
    workspaceId: string,
    currentUserId: string,
  ) => {
    const { role: currentRole } = await getWorkspaceAccess(
      workspaceId,
      currentUserId,
    );

    if (currentRole !== "OWNER" && currentRole !== "ADMIN") {
      throw new Error("You don't have permission to add members");
    }

    // Only OWNER can assign ADMIN
    if (body.role === "ADMIN" && currentRole !== "OWNER") {
      throw new Error("Only workspace owners can assign ADMIN role");
    }

    const user = await workspaceRepository.findUserByEmail(body.email.trim());

    if (!user) {
      throw new Error("User is not registered yet");
    }

    const existingMember = await workspaceRepository.findWorkspaceMember(
      workspaceId,
      user.id,
    );

    if (existingMember) {
      throw new Error("User is already a member");
    }

    return workspaceRepository.createMember(workspaceId, user.id, body.role);
  },
  updateMember: async (
    body: UpdateMemberBody,
    workspaceId: string,
    memberId: string,
    currentUserId: string,
  ) => {
    const { role: currentRole } = await getWorkspaceAccess(
      workspaceId,
      currentUserId,
    );

    if (currentRole !== "OWNER" && currentRole !== "ADMIN") {
      throw new Error("You don't have permission to update members");
    }

    const member = await workspaceRepository.findWorkspaceMember(
      workspaceId,
      memberId,
    );

    if (!member) {
      throw new Error("Member not found");
    }

    if (currentRole === "ADMIN" && member.role === "ADMIN") {
      throw new Error("Admins cannot update other admins");
    }

    if (currentRole === "ADMIN" && body.role === "ADMIN") {
      throw new Error("Only owners can assign ADMIN role");
    }

    return workspaceRepository.updateMember(workspaceId, memberId, body.role);
  },
  deleteMember: async (
    workspaceId: string,
    memberId: string,
    currentUserId: string,
  ) => {
    const { role: currentRole } = await getWorkspaceAccess(
      workspaceId,
      currentUserId,
    );

    if (currentRole !== "OWNER") {
      throw new Error("You don't have permission to update members");
    }

    const member = await workspaceRepository.findWorkspaceMember(
      workspaceId,
      memberId,
    );

    if (!member) {
      throw new Error("Member not found");
    }

    await workspaceRepository.deleteMember(workspaceId, memberId);

    return {
      message: "Member deleted successfully",
    };
  },
};

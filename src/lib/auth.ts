import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { openAPI } from "better-auth/plugins";
import { workspaceService } from "../modules/workspace/service";

export const auth = betterAuth({
  basePath: "/api",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  user: {
    deleteUser: { enabled: true },
    changeEmail: { enabled: true, updateEmailWithoutVerification: true },
  },

  trustedOrigins: [String(process.env.FRONTEND_URL)],

  plugins: [openAPI()],

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await workspaceService.createWorkspaceAfterSignUp(user.id);
        },
      },
    },
  },
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = "/auth/api") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);
      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];
        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method];
          operation.tags = ["Better Auth"];
        }
      }
      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;

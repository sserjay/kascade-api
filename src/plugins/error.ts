import { Elysia } from "elysia";

export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(m: string, c = "BAD_REQUEST") {
    return new AppError(400, c, m);
  }

  static unauthorized(m: string, c = "UNAUTHORIZED") {
    return new AppError(401, c, m);
  }

  static forbidden(m: string, c = "FORBIDDEN") {
    return new AppError(403, c, m);
  }

  static notFound(m: string, c = "NOT_FOUND") {
    return new AppError(404, c, m);
  }

  static conflict(m: string, c = "CONFLICT") {
    return new AppError(409, c, m);
  }

  static unprocessableEntity(m: string, c = "UNPROCESSABLE_ENTITY") {
    return new AppError(422, c, m);
  }
}

export const errorPlugin = new Elysia({ name: "error" })
  .error({ AppError })
  .onError({ as: "global" }, ({ error, code, set }) => {
    if (error instanceof AppError) {
      set.status = error.status;

      return {
        code: error.code,
        message: error.message,
      };
    }

    if (code === "VALIDATION") {
      set.status = 422;

      return {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;

      return {
        code: "NOT_FOUND",
        message: "Route not found",
      };
    }

    console.error(error);

    set.status = 500;

    return {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    };
  });

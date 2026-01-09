// Ponto de entrada da aplicação
// Configura o Express, middlewares, rotas e inicia o servidor

import express from "express";
import cors from "cors";
import { Config } from "./config";
import { logger } from "./logger";
import { UserRepositoryImpl } from "./api/infraestructure/UserRepositoryImpl";
import { PostRepositoryImpl } from "./api/infraestructure/PostRepositoryImpl";
import { AwsS3FileStorage } from "./api/infraestructure/file-storage-impl";
import { UseCasesFactory } from "./api/application/container/factories/use-cases-factory";
import { SignUpUserController } from "./api/application/use-cases/sign-up-user/sign-up-user-controller";
import { SignInUserController } from "./api/application/use-cases/sign-in-user/sign-in-user-controller";
import { CreatePostController } from "./api/application/use-cases/create-post/create-post-controller";
import { ListPostsController } from "./api/application/use-cases/list-posts/list-posts-controller";
import { UpdatePostController } from "./api/application/use-cases/update-post/update-post-controller";
import { DeletePostController } from "./api/application/use-cases/delete-post/delete-post-controller";
import { createRoutes } from "./api/application/container/routes";
import { createHealthRoutes } from "./api/application/container/routes/health";

async function bootstrap(): Promise<void> {
  const config = Config.getInstance();
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Repositórios (in-memory)
  const userRepository = new UserRepositoryImpl();
  const postRepository = new PostRepositoryImpl();

  // File Storage (AWS S3)
  const fileStorage = new AwsS3FileStorage();

  // Factory de use cases
  const useCasesFactory = new UseCasesFactory(
    userRepository,
    postRepository,
    fileStorage,
    config.jwtSecret
  );

  // Controllers
  const signUpUserController = new SignUpUserController(
    useCasesFactory.createSignUpUserUseCase()
  );
  const signInUserController = new SignInUserController(
    useCasesFactory.createSignInUserUseCase()
  );
  const createPostController = new CreatePostController(
    useCasesFactory.createCreatePostUseCase()
  );
  const listPostsController = new ListPostsController(
    useCasesFactory.createListPostsUseCase()
  );
  const updatePostController = new UpdatePostController(
    useCasesFactory.createUpdatePostUseCase()
  );
  const deletePostController = new DeletePostController(
    useCasesFactory.createDeletePostUseCase()
  );

  // Rotas
  app.use("/health", createHealthRoutes());
  app.use(
    "/api",
    createRoutes(
      signUpUserController,
      signInUserController,
      createPostController,
      listPostsController,
      updatePostController,
      deletePostController
    )
  );

  // Iniciar servidor
  app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});

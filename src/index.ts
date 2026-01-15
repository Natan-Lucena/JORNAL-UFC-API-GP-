// Ponto de entrada da aplicação
// Configura o Express, middlewares, rotas e inicia o servidor

import express from "express";
import cors from "cors";
import { Config } from "./config";
import { logger } from "./logger";
import { UserRepositoryPrismaImpl } from "./api/infraestructure/UserRepositoryPrismaImpl";
import { PostRepositoryPrismaImpl } from "./api/infraestructure/PostRepositoryPrismaImpl";
import { LikeRepositoryPrismaImpl } from "./api/infraestructure/LikeRepositoryPrismaImpl";
import { CommentRepositoryPrismaImpl } from "./api/infraestructure/CommentRepositoryPrismaImpl";
import { AwsS3FileStorage } from "./api/infraestructure/file-storage-impl";
import { UseCasesFactory } from "./api/application/container/factories/use-cases-factory";
import { SignUpUserController } from "./api/application/use-cases/sign-up-user/sign-up-user-controller";
import { SignInUserController } from "./api/application/use-cases/sign-in-user/sign-in-user-controller";
import { UpdateUserController } from "./api/application/use-cases/update-user/update-user-controller";
import { CreatePostController } from "./api/application/use-cases/create-post/create-post-controller";
import { ListPostsController } from "./api/application/use-cases/list-posts/list-posts-controller";
import { UpdatePostController } from "./api/application/use-cases/update-post/update-post-controller";
import { DeletePostController } from "./api/application/use-cases/delete-post/delete-post-controller";
import { GetPostByIdController } from "./api/application/use-cases/get-post-by-id/get-post-by-id-controller";
import { ToggleLikeController } from "./api/application/use-cases/toggle-like/toggle-like-controller";
import { CreateCommentController } from "./api/application/use-cases/create-comment/create-comment-controller";
import { DeleteCommentController } from "./api/application/use-cases/delete-comment/delete-comment-controller";
import { createRoutes } from "./api/application/container/routes";
import { createHealthRoutes } from "./api/application/container/routes/health";

async function bootstrap(): Promise<void> {
  const config = Config.getInstance();
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Repositórios (Prisma - produção)
  const userRepository = new UserRepositoryPrismaImpl();
  const postRepository = new PostRepositoryPrismaImpl();
  const likeRepository = new LikeRepositoryPrismaImpl();
  const commentRepository = new CommentRepositoryPrismaImpl();

  // File Storage (AWS S3)
  const fileStorage = new AwsS3FileStorage();

  // Factory de use cases
  const useCasesFactory = new UseCasesFactory(
    userRepository,
    postRepository,
    likeRepository,
    commentRepository,
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
  const updateUserController = new UpdateUserController(
    useCasesFactory.createUpdateUserUseCase()
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
  const getPostByIdController = new GetPostByIdController(
    useCasesFactory.createGetPostByIdUseCase()
  );
  const toggleLikeController = new ToggleLikeController(
    useCasesFactory.createToggleLikeUseCase()
  );
  const createCommentController = new CreateCommentController(
    useCasesFactory.createCreateCommentUseCase()
  );
  const deleteCommentController = new DeleteCommentController(
    useCasesFactory.createDeleteCommentUseCase()
  );

  // Rotas
  app.use("/health", createHealthRoutes());
  app.use(
    "/api",
    createRoutes(
      signUpUserController,
      signInUserController,
      updateUserController,
      createPostController,
      listPostsController,
      updatePostController,
      deletePostController,
      getPostByIdController,
      toggleLikeController,
      createCommentController,
      deleteCommentController
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

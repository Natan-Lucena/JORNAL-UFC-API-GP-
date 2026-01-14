import { Router } from "express";
import { createAuthRoutes } from "./auth";
import { SignUpUserController } from "../../use-cases/sign-up-user/sign-up-user-controller";
import { SignInUserController } from "../../use-cases/sign-in-user/sign-in-user-controller";
import { CreatePostController } from "../../use-cases/create-post/create-post-controller";
import { ListPostsController } from "../../use-cases/list-posts/list-posts-controller";
import { UpdatePostController } from "../../use-cases/update-post/update-post-controller";
import { DeletePostController } from "../../use-cases/delete-post/delete-post-controller";
import { GetPostByIdController } from "../../use-cases/get-post-by-id/get-post-by-id-controller";
import { ToggleLikeController } from "../../use-cases/toggle-like/toggle-like-controller";
import { CreateCommentController } from "../../use-cases/create-comment/create-comment-controller";
import { DeleteCommentController } from "../../use-cases/delete-comment/delete-comment-controller";
import { authMiddleware } from "../middlewares/auth-middleware";
import { Multer } from "../../../infraestructure/upload/multer-config";

export function createRoutes(
  signUpUserController: SignUpUserController,
  signInUserController: SignInUserController,
  createPostController: CreatePostController,
  listPostsController: ListPostsController,
  updatePostController: UpdatePostController,
  deletePostController: DeletePostController,
  getPostByIdController: GetPostByIdController,
  toggleLikeController: ToggleLikeController,
  createCommentController: CreateCommentController,
  deleteCommentController: DeleteCommentController
): Router {
  const router = Router();

  router.use(
    "/auth",
    createAuthRoutes(signUpUserController, signInUserController)
  );

  // Configurar multer para upload de imagem (limite de 10MB)
  const upload = Multer.getUploader(10).single("media");

  // Rotas de posts
  router.post("/posts", authMiddleware, upload, (req, res) => {
    createPostController.handle(req, res);
  });
  router.get("/posts", authMiddleware, (req, res) => {
    listPostsController.handle(req, res);
  });
  router.get("/posts/:id", authMiddleware, (req, res) => {
    getPostByIdController.handle(req, res);
  });
  router.put("/posts/:id", authMiddleware, upload, (req, res) => {
    updatePostController.handle(req, res);
  });
  router.delete("/posts/:id", authMiddleware, (req, res) => {
    deletePostController.handle(req, res);
  });

  // Rotas de likes
  router.post("/posts/:postId/likes", authMiddleware, (req, res) => {
    toggleLikeController.handle(req, res);
  });

  // Rotas de comentários
  router.post("/comments", authMiddleware, (req, res) => {
    createCommentController.handle(req, res);
  });
  router.delete("/comments/:id", authMiddleware, (req, res) => {
    deleteCommentController.handle(req, res);
  });

  return router;
}

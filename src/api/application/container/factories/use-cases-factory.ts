import { UserRepository } from "../../../domain/repository/UserRepository";
import { PostRepository } from "../../../domain/repository/PostRepository";
import { LikeRepository } from "../../../domain/repository/LikeRepository";
import { CommentRepository } from "../../../domain/repository/CommentRepository";
import { SignUpUserUseCase } from "../../use-cases/sign-up-user/sign-up-user";
import { SignInUserUseCase } from "../../use-cases/sign-in-user/sign-in-user";
import { CreatePostUseCase } from "../../use-cases/create-post/create-post";
import { ListPostsUseCase } from "../../use-cases/list-posts/list-posts";
import { UpdatePostUseCase } from "../../use-cases/update-post/update-post";
import { DeletePostUseCase } from "../../use-cases/delete-post/delete-post";
import { ToggleLikeUseCase } from "../../use-cases/toggle-like/toggle-like";
import { CreateCommentUseCase } from "../../use-cases/create-comment/create-comment";
import { DeleteCommentUseCase } from "../../use-cases/delete-comment/delete-comment";
import { GetPostByIdUseCase } from "../../use-cases/get-post-by-id/get-post-by-id";
import { FileStorage } from "../../service/file-storage";

export class UseCasesFactory {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository,
    private likeRepository: LikeRepository,
    private commentRepository: CommentRepository,
    private fileStorage: FileStorage,
    private jwtSecret: string
  ) {}

  createSignUpUserUseCase(): SignUpUserUseCase {
    return new SignUpUserUseCase(this.userRepository);
  }

  createSignInUserUseCase(): SignInUserUseCase {
    return new SignInUserUseCase(this.userRepository, this.jwtSecret);
  }

  createCreatePostUseCase(): CreatePostUseCase {
    return new CreatePostUseCase(
      this.postRepository,
      this.userRepository,
      this.fileStorage
    );
  }

  createListPostsUseCase(): ListPostsUseCase {
    return new ListPostsUseCase(this.postRepository);
  }

  createUpdatePostUseCase(): UpdatePostUseCase {
    return new UpdatePostUseCase(
      this.postRepository,
      this.userRepository,
      this.fileStorage
    );
  }

  createDeletePostUseCase(): DeletePostUseCase {
    return new DeletePostUseCase(this.postRepository);
  }

  createGetPostByIdUseCase(): GetPostByIdUseCase {
    return new GetPostByIdUseCase(
      this.postRepository,
      this.likeRepository,
      this.commentRepository,
      this.userRepository
    );
  }

  createToggleLikeUseCase(): ToggleLikeUseCase {
    return new ToggleLikeUseCase(this.likeRepository, this.postRepository);
  }

  createCreateCommentUseCase(): CreateCommentUseCase {
    return new CreateCommentUseCase(
      this.commentRepository,
      this.postRepository
    );
  }

  createDeleteCommentUseCase(): DeleteCommentUseCase {
    return new DeleteCommentUseCase(this.commentRepository);
  }
}

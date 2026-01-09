import { UserRepository } from "../../../domain/repository/UserRepository";
import { PostRepository } from "../../../domain/repository/PostRepository";
import { SignUpUserUseCase } from "../../use-cases/sign-up-user/sign-up-user";
import { SignInUserUseCase } from "../../use-cases/sign-in-user/sign-in-user";
import { CreatePostUseCase } from "../../use-cases/create-post/create-post";
import { ListPostsUseCase } from "../../use-cases/list-posts/list-posts";
import { UpdatePostUseCase } from "../../use-cases/update-post/update-post";
import { DeletePostUseCase } from "../../use-cases/delete-post/delete-post";
import { FileStorage } from "../../service/file-storage";

export class UseCasesFactory {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository,
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
}

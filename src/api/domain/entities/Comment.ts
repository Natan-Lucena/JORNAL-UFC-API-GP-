export interface CommentProps {
  id: string;
  text: string;
  userId: string;
  postId: string;
}

export class Comment {
  private constructor(private props: CommentProps) {}

  static create(
    props: Omit<CommentProps, "id"> & { id?: string }
  ): Comment {
    return new Comment({
      id: props.id || crypto.randomUUID(),
      text: props.text,
      userId: props.userId,
      postId: props.postId,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get text(): string {
    return this.props.text;
  }

  get userId(): string {
    return this.props.userId;
  }

  get postId(): string {
    return this.props.postId;
  }

  toJSON() {
    return {
      id: this.props.id,
      text: this.props.text,
      userId: this.props.userId,
      postId: this.props.postId,
    };
  }
}

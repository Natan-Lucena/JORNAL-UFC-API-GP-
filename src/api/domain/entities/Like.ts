export interface LikeProps {
  id: string;
  postId: string;
  userId: string;
}

export class Like {
  private constructor(private props: LikeProps) {}

  static create(props: Omit<LikeProps, "id"> & { id?: string }): Like {
    return new Like({
      id: props.id || crypto.randomUUID(),
      postId: props.postId,
      userId: props.userId,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get postId(): string {
    return this.props.postId;
  }

  get userId(): string {
    return this.props.userId;
  }

  toJSON() {
    return {
      id: this.props.id,
      postId: this.props.postId,
      userId: this.props.userId,
    };
  }
}

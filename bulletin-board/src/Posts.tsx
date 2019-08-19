import React from 'react';

const API = 'http://localhost:4000/api/v1/posts';
type IProps = {};

type IState = {
  posts: Post[];
  isLoading: boolean;
  errors: any;
};
type Post = {
  id: number;
  post: string;
  topic: string;
  datetime: Date;
  pinned: boolean;
  modified: Date;
};

class Posts extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      posts: [],
      isLoading: true,
      errors: null
    };
  }
  componentDidMount() {
    setTimeout(this.getAndSetPosts, 5000);
  }
  getAndSetPosts = () => {
    this.setState({ isLoading: true, errors: null });
    fetch(API)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(data => this.setState({ posts: data, isLoading: false }))
      .catch(errors => this.setState({ errors, isLoading: false }));
  };

  render() {
    const { posts, isLoading, errors } = this.state;

    if (isLoading) {
      return <p>Loading posts...</p>;
    }
    if (errors) {
      return (
        <div className="errorContainer">
          <p>Loading posts failed!</p>
          <button onClick={this.getAndSetPosts}>Try again</button>
        </div>
      );
    }

    return (
      <div className="container">
        <h1>Epic posts</h1>
        {posts.map(post => (
          <div key={post.id} className="posts">
            <h5 className="post-topic">{post.topic}</h5>
            <h6 className="post-post">{post.post}</h6>
          </div>
        ))}
      </div>
    );
  }
}

export default Posts;

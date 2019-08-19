import React from "react";

const API = "http://localhost:4000/api/v1/posts";
interface Props {}

interface State {
  posts: Post[];
}
interface Post {
  id: number;
  post: string;
  topic: string;
  datetime: Date;
  pinned: boolean;
  modified: Date;
}

class Posts extends React.Component<Props, State> {
  state: State = {
    posts: []
  };
  componentDidMount() {
    this.getAndSetPosts();
  }
  getAndSetPosts = () => {
    fetch(API)
      .then(response => response.json())
      .then(data => this.setState({ posts: data }))
      .catch(error => console.log(error));
  };

  render() {
    return (
      <div className="container">
        <h1>Epic posts</h1>
        {this.state.posts.map(post => (
          <div className="posts">
            <div className="post-body">
              <h5 className="post-topic">{post.topic}</h5>
              <h6 className="post-post">{post.post}</h6>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Posts;

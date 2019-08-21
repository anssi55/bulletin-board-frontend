import React from 'react';

const API = 'http://localhost:4000/api/v1/';
type Props = {};

type State = {
  posts: Post[];
  categories: Category[];
  isLoading: boolean;
  errors: Error[];
  newPostErrors: Error[];
  formIsValid: boolean;
  topicValue: string;
  topicValid: boolean;
  postValue: string;
  postValid: boolean;
  categoryValue: string;
  pinnedValue: boolean;
  pinnedValid: boolean;
};
type Post = {
  id: number;
  post: string;
  topic: string;
  datetime: Date;
  pinned: boolean;
  modified: Date;
};
type Category = {
  id: number;
  name: string;
  description: string;
};

class Posts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      posts: [],
      isLoading: false,
      errors: [],
      newPostErrors: [],
      categories: [],
      formIsValid: false,
      topicValue: '',
      topicValid: false,
      postValue: '',
      postValid: false,
      pinnedValue: false,
      pinnedValid: true,
      categoryValue: '1'
    };
  }
  componentDidMount() {
    this.getAndSetPosts();
    this.getCategories();
  }
  getCategories = async () => {
    fetch(API + 'categories')
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(data => this.setState({ categories: data, isLoading: false }))
      .catch(errors => this.setState({ errors, isLoading: false }));
  };
  handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    this.setState({
      categoryValue: newValue
    });
  };
  handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const post = event.target.value;
    this.setState({
      postValue: post
    });
    this.validatePost(post);
  };
  handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const topic = event.target.value;
    this.setState({
      topicValue: topic
    });
    this.validateTopic(topic);
  };
  handlePinnedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pinned = event.target.checked;
    this.setState({
      pinnedValue: pinned
    });
    this.validatePinned(pinned);
  };
  handleSubmit = async (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    event.preventDefault();
    this.saveNewPost();
  };
  saveNewPost = async () => {
    const data = {
      post: this.state.postValue,
      topic: this.state.topicValue,
      pinned: this.state.pinnedValue,
      categoryId: parseInt(this.state.categoryValue)
    };

    return fetch(API + 'posts', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      referrer: 'no-referrer',
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => this.setState({ posts: [...this.state.posts, data] }))
      .catch(errors => this.setState({ newPostErrors: errors }));
  };

  getAndSetPosts = async () => {
    this.setState({ isLoading: true, errors: [] });
    fetch(API + 'posts')
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
  validatePost = (post: String) => {
    if (post.length >= 10 && post.length <= 255) {
      this.setState({ postValid: true });
    } else {
      this.setState({ postValid: false });
    }
    this.isAllValid();
  };
  validateTopic = (topic: String) => {
    if (topic.length >= 5 && topic.length <= 50) {
      this.setState({ topicValid: true });
    } else {
      this.setState({ topicValid: false });
    }
    this.isAllValid();
  };
  validatePinned = (pinned: boolean) => {
    if (pinned === true || pinned === false) {
      this.setState({ pinnedValid: true });
      this.isAllValid();
    } else {
      this.setState({ pinnedValid: false });
    }
    this.isAllValid();
  };

  isAllValid = () => {
    console.log(this.state.postValid, this.state.topicValid, this.state.pinnedValid);
    if (this.state.postValid && this.state.topicValid && this.state.pinnedValid) {
      this.setState({ formIsValid: true });
    } else {
      this.setState({ formIsValid: false });
    }
  };

  render() {
    const {
      categories,
      posts,
      isLoading,
      errors,
      categoryValue,
      postValue,
      topicValue,
      pinnedValue,
      formIsValid
    } = this.state;

    if (isLoading) {
      return <p>Loading posts...</p>;
    }
    if (errors === []) {
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
        <form>
          <div>
            <input
              type="text"
              placeholder="Insert topic here.."
              name="topic"
              value={topicValue}
              onChange={this.handleTopicChange}
            />
          </div>
          <label>
            Post:
            <textarea
              value={postValue}
              placeholder="Insert post here.."
              onChange={this.handlePostChange}
            />
          </label>
          <label>
            Pinned:
            <input
              name="pinned"
              type="checkbox"
              checked={pinnedValue}
              onChange={this.handlePinnedChange}
            />
          </label>
          <select
            className="categoryDropdown"
            value={categoryValue}
            onChange={this.handleSelectChange}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="submit"
            className="button"
            disabled={!formIsValid}
            onClick={this.handleSubmit}
          />
        </form>
      </div>
    );
  }
}

export default Posts;

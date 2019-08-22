import React from 'react';
import Moment from 'react-moment';

const API = 'http://localhost:4000/api/v1/';
type Props = {};

type State = {
  posts: Post[];
  categories: Category[];
  isLoading: boolean;
  errors: any;
  newPostErrors: string;
  formIsValid: boolean;
  topicValue: string;
  topicValid: boolean;
  postValue: string;
  postValid: boolean;
  categoryValue: string;
  pinnedValue: boolean;
  postsLoading: boolean;
  categoriesLoading: boolean;
  topicError: string;
  postError: string;
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
      errors: undefined,
      newPostErrors: '',
      categories: [],
      formIsValid: false,
      topicValue: '',
      topicValid: false,
      postValue: '',
      postValid: false,
      pinnedValue: false,
      categoryValue: '1',
      postsLoading: false,
      categoriesLoading: false,
      topicError: '',
      postError: ''
    };
  }
  componentDidMount() {
    this.loadPostsAndCategories();
  }
  loadPostsAndCategories = async () => {
    this.setState({ isLoading: true, errors: undefined });
    await this.getAndSetPosts();
    await this.getCategories();
  };
  getAndSetPosts = async () => {
    this.setState({ postsLoading: true });
    fetch(API + 'posts')
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(data => this.setState({ posts: data, postsLoading: false }))
      .then(() => this.isBothLoaded())
      .catch(errors => this.setState({ errors, isLoading: false }));
  };
  getCategories = async () => {
    this.setState({ categoriesLoading: true });
    fetch(API + 'categories')
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(data => this.setState({ categories: data, categoriesLoading: false }))
      .then(() => this.isBothLoaded())
      .catch(errors => this.setState({ errors, isLoading: false }));
  };
  saveNewPost = async () => {
    const data = {
      post: this.state.postValue,
      topic: this.state.topicValue,
      pinned: this.state.pinnedValue,
      categoryId: parseInt(this.state.categoryValue)
    };

    fetch(API + 'posts', {
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
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(data => this.setState({ posts: [...this.state.posts, data] }))
      .catch(() => this.setState({ newPostErrors: 'Could not save the post!' }));
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
    this.isAllValid();
  };
  handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const topic = event.target.value;
    this.setState({
      topicValue: topic
    });
    this.validateTopic(topic);
    this.isAllValid();
  };
  handlePinnedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pinned = event.target.checked;
    this.setState({
      pinnedValue: pinned
    });
  };
  handleSubmit = async (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    event.preventDefault();
    this.saveNewPost();
  };

  validatePost = (post: String) => {
    if (post.length < 10) {
      this.setState({ postError: 'Post is too short', postValid: false });
    } else if (post.length > 255) {
      this.setState({ postError: 'Post is too long', postValid: false });
    } else {
      this.setState({ postError: '', postValid: true });
    }
  };
  validateTopic = (topic: String) => {
    if (topic.length < 5) {
      this.setState({ topicError: 'Topic is too short', topicValid: false });
    } else if (topic.length > 50) {
      this.setState({ topicError: 'Topic is too long', topicValid: false });
    } else {
      this.setState({ topicError: '', topicValid: true });
    }
  };

  isAllValid = () => {
    if (this.state.postValid && this.state.topicValid) {
      this.setState({ formIsValid: true });
    } else {
      this.setState({ formIsValid: false });
    }
  };
  isBothLoaded = () => {
    if (!this.state.postsLoading && !this.state.categoriesLoading) {
      this.setState({ isLoading: false });
    } else {
      this.setState({ isLoading: true });
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
      formIsValid,
      newPostErrors,
      postError,
      topicError
    } = this.state;

    if (isLoading) {
      return <p>Loading posts...</p>;
    }
    if (errors) {
      return (
        <div className="errorContainer">
          <p>Loading posts failed!</p>
          <button onClick={this.loadPostsAndCategories}>Try again</button>
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
            <Moment format="HH:mm DD.MM.YYYY">{post.datetime.toString()}</Moment>
          </div>
        ))}
        <form>
          <div>
            <label>
              Topic:
              <input
                type="text"
                placeholder="Insert topic here.."
                name="topic"
                value={topicValue}
                onChange={this.handleTopicChange}
              />
            </label>
            {topicError}
          </div>
          <div>
            <label>
              Post:
              <textarea
                value={postValue}
                placeholder="Insert post here.."
                onChange={this.handlePostChange}
              />
            </label>
            {postError}
          </div>

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
          <div className="postingErrors">{newPostErrors}</div>
        </form>
      </div>
    );
  }
}

export default Posts;

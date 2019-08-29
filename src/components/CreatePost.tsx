import React, { useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import postPostService, { PostPost } from '../services/usePostPostService';
import { Post } from '../types/Post';
import { Service } from '../types/Service';
import { Category } from '../types/Category';
import './createPost.css';
interface Props {
  reFetchPosts: (post: Post) => void;
  categoryService: Service<Category[]>;
}
const CreatePost: React.FC<Props> = props => {
  const initialPostState: PostPost = {
    post: '',
    topic: '',
    pinned: false,
    categoryId: 1
  };

  const [post, setPost] = React.useState<PostPost>(initialPostState);
  const { service, makePost } = postPostService();
  const [postError, setPostError] = useState('');
  const [topicError, setTopicError] = useState('');
  const [postValid, setPostValid] = useState(false);
  const [topicValid, setTopicValid] = useState(false);

  useEffect(() => {
    props.categoryService.status === 'loaded' &&
      setInitialCategory(props.categoryService.payload[1].id);
  }, [props.categoryService]);

  const setInitialCategory = (id: number) => {
    setPost(prevPost => ({
      ...prevPost,
      categoryId: id
    }));
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setPost(prevPost => ({
      ...prevPost,
      [event.target.name]: event.target.value
    }));
    validateTopic(event.target.value);
  };
  const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.persist();
    setPost(prevPost => ({
      ...prevPost,
      [event.target.name]: event.target.value
    }));
    validatePost(event.target.value);
  };
  const handlePinnedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setPost(prevPost => ({
      ...prevPost,
      pinned: event.target.checked
    }));
  };
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.persist();
    setPost(prevPost => ({
      ...prevPost,
      [event.target.name]: parseInt(event.target.value)
    }));
  };

  const handleSubmit = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    event.preventDefault();
    makePost(post)
      .then(result => props.reFetchPosts(result))
      .then(() => setPost(initialPostState));
  };

  const validatePost = (post: String) => {
    if (post.length < 10) {
      setPostValid(false);
      setPostError('Post is too short');
    } else if (post.length > 255) {
      setPostValid(false);
      setPostError('Post is too long');
    } else {
      setPostValid(true);
      setPostError('');
    }
  };
  const validateTopic = (topic: String) => {
    if (topic.length < 5) {
      setTopicValid(false);
      setTopicError('Topic is too short');
    } else if (topic.length > 50) {
      setTopicValid(false);
      setTopicError('Topic is too long');
    } else {
      setTopicValid(true);
      setTopicError('');
    }
  };

  return (
    <div className="createPostContainer">
      {props.categoryService.status === 'loaded' && (
        <div className="postForm">
          <form>
            <div className="formTopic">
              <label>
                Topic:
                <input
                  type="text"
                  placeholder="Insert topic here.."
                  name="topic"
                  value={post.topic}
                  onChange={handleTopicChange}
                />
              </label>
              <div className="error">{topicError}</div>
            </div>
            <div className="formPost">
              <label>
                Post:
                <textarea
                  name="post"
                  value={post.post}
                  placeholder="Insert post here.."
                  onChange={handlePostChange}
                />
              </label>
              <div className="error">{postError}</div>
            </div>

            <div className="formPinned">
              <label>
                Pinned:
                <input
                  name="pinned"
                  type="checkbox"
                  checked={post.pinned}
                  onChange={handlePinnedChange}
                />
              </label>
            </div>
            <div className="submit">
              <select
                className="categoryDropdown"
                value={post.categoryId}
                onChange={handleCategoryChange}
                name="categoryId"
              >
                {props.categoryService.payload.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="submit"
                className="button"
                disabled={!postValid || !topicValid}
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      )}
      {service.status === 'loading' && (
        <div className="loader-container">
          <PulseLoader />
        </div>
      )}

      {service.status === 'error' && (
        <div className="postingErrors">Error. Post could not be the posted!</div>
      )}
    </div>
  );
};

export default CreatePost;

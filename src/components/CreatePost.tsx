import React, { useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import postPostService, { PostPost } from '../services/usePostPostService';
import { Post } from '../types/Post';
import { Service } from '../types/Service';
import { Category } from '../types/Category';
interface Props {
  addPost: (post: Post) => void;
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
  const [formValid, setFormValid] = useState(false);

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
      [event.target.name]: event.target.checked
    }));
    handlePinnedChange(event);
  };
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.persist();
    setPost(prevPost => ({
      ...prevPost,
      [event.target.name]: parseInt(event.target.value)
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    makePost(post)
      .then(result => props.addPost(result))
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
      isAllValid();
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
      isAllValid();
    }
  };

  const isAllValid = () => {
    if (postValid && topicValid) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  return (
    <>
      <div className="postForm">
        <form onSubmit={handleSubmit}>
          <div>
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
            {topicError}
          </div>
          <div>
            <label>
              Post:
              <textarea
                name="post"
                value={post.post}
                placeholder="Insert post here.."
                onChange={handlePostChange}
              />
            </label>
            {postError}
          </div>
          <div>
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
          <select
            className="categoryDropdown"
            value={post.categoryId}
            onChange={handleCategoryChange}
            name="categoryId"
          >
            {props.categoryService.status === 'loaded' &&
              props.categoryService.payload.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
          <input type="submit" className="button" disabled={!formValid} />
        </form>
      </div>
      {service.status === 'loading' && (
        <div className="loader-container">
          <PulseLoader />
        </div>
      )}

      {service.status === 'error' && (
        <div className="postingErrors">Error. Post could not be the posted!</div>
      )}
    </>
  );
};

export default CreatePost;

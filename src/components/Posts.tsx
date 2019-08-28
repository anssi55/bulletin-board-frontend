import React from 'react';
import { PacmanLoader } from 'react-spinners';
import { format, parseISO } from 'date-fns';
import { Service } from '../types/Service';
import { Post } from '../types/Post';

interface Props {
  posts: Service<Post[]>;
  reloadPosts: () => void;
}
const Posts: React.FC<Props> = props => {
  return (
    <>
      <div className="posts">
        {props.posts.status === 'loading' && (
          <div className="loader-container">
            <PacmanLoader />
          </div>
        )}
        {props.posts.status === 'loaded' &&
          props.posts.payload.map(post => (
            <div key={post.id}>
              <h5 className="post-topic">{post.topic}</h5>
              <h6 className="post-post">{post.post}</h6>
              <h6> {format(parseISO(post.created.toString()), 'Pp')}</h6>
            </div>
          ))}
      </div>
      {props.posts.status === 'error' && (
        <div>
          <div>Loading posts failed!</div>
          <button onClick={props.reloadPosts}>Try again</button>
        </div>
      )}
    </>
  );
};

export default Posts;

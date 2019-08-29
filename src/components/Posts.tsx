import React from 'react';
import { PacmanLoader } from 'react-spinners';
import { format, parseISO, compareDesc } from 'date-fns';
import { Service } from '../types/Service';
import { Post } from '../types/Post';

interface Props {
  postService: Service<Post[]>;
  reFetch: () => void;
}
const Posts: React.FC<Props> = props => {
  return (
    <>
      <div className="posts">
        {props.postService.status === 'loading' && (
          <div className="loader-container">
            <PacmanLoader />
          </div>
        )}
        {props.postService.status === 'loaded' &&
          props.postService.payload
            .sort(function(a, b) {
              return compareDesc(parseISO(a.created.toString()), parseISO(b.created.toString()));
            })
            .map(post => (
              <div key={post.id}>
                <h5 className="post-topic">{post.topic}</h5>
                <h6 className="post-post">{post.post}</h6>
                <h6> {format(parseISO(post.created.toString()), 'Pp')}</h6>
              </div>
            ))}
      </div>
      {props.postService.status === 'error' && (
        <div>
          <div>Loading posts failed!</div>
          <button onClick={props.reFetch}>Try again</button>
        </div>
      )}
    </>
  );
};

export default Posts;

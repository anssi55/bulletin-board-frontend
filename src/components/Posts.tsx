import React from 'react';
import { PacmanLoader } from 'react-spinners';
import { format, parseISO, compareDesc } from 'date-fns';
import { Service } from '../types/Service';
import { Post } from '../types/Post';
import './posts.css';
import { FaMapPin } from 'react-icons/fa';

interface Props {
  postService: Service<Post[]>;
  reFetch: () => void;
}
const Posts: React.FC<Props> = props => {
  return (
    <div className="postsContainer">
      {props.postService.status === 'loading' && (
        <div className="loader-container">
          <PacmanLoader />
        </div>
      )}
      {props.postService.status === 'loaded' &&
        props.postService.payload
          .sort(function(a, b) {
            return (
              (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1) ||
              compareDesc(parseISO(a.created.toString()), parseISO(b.created.toString()))
            );
          })
          .map(post => (
            <div className="thread" key={post.id}>
              <div className="topicRow">
                {post.pinned === true && (
                  <div className="pinned">
                    <FaMapPin />
                  </div>
                )}
                <div className="topic">{post.topic}</div>
              </div>
              <div className="info">
                {'No. ' + post.id + ',  '}
                <time>{format(parseISO(post.created.toString()), 'Pp')}</time>
              </div>
              <div className="post">{post.post}</div>
            </div>
          ))}

      {props.postService.status === 'error' && (
        <div>
          <div>Loading posts failed!</div>
          <button onClick={props.reFetch}>Try again</button>
        </div>
      )}
    </div>
  );
};

export default Posts;

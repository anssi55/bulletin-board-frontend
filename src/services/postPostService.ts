import { useState } from 'react';
import { Service } from '../types/Service';
import { Post } from '../types/Post';
import { URL } from '../constants';

export type PostPost = {
  post: string;
  topic: string;
  pinned: boolean;
  categoryId: number;
};

const postPost = () => {
  const [service, setService] = useState<Service<Post>>({
    status: 'init'
  });

  const makePost = (post: PostPost) => {
    setService({ status: 'loading' });

    return new Promise((resolve, reject) => {
      fetch(URL + 'posts', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        referrer: 'no-referrer',
        body: JSON.stringify(post)
      })
        .then(response => response.json())
        .then(response => {
          setService({ status: 'loaded', payload: response });
          resolve(response);
        })
        .catch(error => {
          setService({ status: 'error', error });
          reject(error);
        });
    });
  };

  return {
    service,
    makePost
  };
};

export default postPost;

import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { Post } from '../types/Post';
import { URL } from '../constants';

const FetchPosts = () => {
  const [result, setResult] = useState<Service<Post[]>>({
    status: 'loading'
  });

  useEffect(() => {
    fetch(URL + 'posts')
      .then(response => {
        if (response.status === 404) {
          return [];
        } else if (response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then(response => setResult({ status: 'loaded', payload: response }))
      .catch(error => setResult({ status: 'error', error }));
  }, []);

  return result;
};

export default FetchPosts;

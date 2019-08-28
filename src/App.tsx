import React, { useEffect } from 'react';
import Posts from './components/Posts';
import CreatePost from './components/CreatePost';
import usePostsService from './services/usePostsService';
import { Post } from './types/Post';

const App: React.FC<{}> = () => {
  const service = usePostsService();

  function reloadPosts() {
    service.fetchPosts();
  }

  function addPost(post: Post) {
    service.result.status === 'loaded' &&
      service.setResult({ status: 'loaded', payload: [...service.result.payload, post] });
  }
  useEffect(() => {
    service.fetchPosts();
  }, []);

  return (
    <div className="App">
      <header className="header"></header>
      <div className="container">
        <CreatePost addPost={addPost} />
        <h1>Epic Posts </h1>
        <Posts posts={service.result} reloadPosts={reloadPosts} />
      </div>
    </div>
  );
};

export default App;

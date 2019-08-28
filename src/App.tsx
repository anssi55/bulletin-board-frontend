import React, { useEffect } from 'react';
import Posts from './components/Posts';
import CreatePost from './components/CreatePost';
import usePostService from './services/usePostService';
import { Post } from './types/Post';
import useCategoryService from './services/useCategoryService';

const App: React.FC<{}> = () => {
  const postService = usePostService();
  const categoryService = useCategoryService();

  const reFetch = () => {
    postService.fetchPosts();
    categoryService.fetchCategories();
  };
  const addPost = (post: Post) => {
    postService.result.status === 'loaded' &&
      postService.setResult({ status: 'loaded', payload: [...postService.result.payload, post] });
  };
  useEffect(() => {
    postService.fetchPosts();
    categoryService.fetchCategories();
  }, []);

  return (
    <div className="App">
      <header className="header"></header>
      <div className="container">
        <CreatePost addPost={addPost} categoryService={categoryService.result} />
        <h1>Epic Posts </h1>
        <Posts postService={postService.result} reFetch={reFetch} />
      </div>
    </div>
  );
};

export default App;

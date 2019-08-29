import React from 'react';
import Posts from './components/Posts';
import CreatePost from './components/CreatePost';
import usePostService from './services/usePostService';
import useCategoryService from './services/useCategoryService';

const App: React.FC<{}> = () => {
  let postService = usePostService();
  let categoryService = useCategoryService();

  const reFetch = () => {
    postService.fetchPosts();
    categoryService.fetchCategories();
  };

  return (
    <div className="App">
      <header className="header"></header>
      <div className="container">
        <CreatePost
          reFetchPosts={postService.fetchPosts}
          categoryService={categoryService.result}
        />
        <Posts postService={postService.result} reFetch={reFetch} />
      </div>
    </div>
  );
};

export default App;

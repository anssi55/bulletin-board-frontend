import { useState } from 'react';
import { Service } from '../types/Service';
import { URL } from '../constants/constants';
import { Category } from '../types/Category';

const useCategoryService = () => {
  const [result, setResult] = useState<Service<Category[]>>({
    status: 'loading'
  });

  const fetchCategories = () => {
    setResult({ status: 'loading' });

    return new Promise<Category>((resolve, reject) => {
      fetch(URL + 'categories')
        .then(response => {
          if (response.status === 404) {
            return [];
          } else if (response.ok) {
            return response.json();
          } else {
            throw Error(response.statusText);
          }
        })
        .then(response => {
          setResult({ status: 'loaded', payload: response });
          resolve(response);
        })
        .catch(error => {
          setResult({ status: 'error', error });
          reject(error);
        });
    });
  };
  return { result, fetchCategories };
};

export default useCategoryService;

import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { URL } from '../constants/constants';
import { Category } from '../types/Category';

const useCategoriesService = () => {
  const [result, setResult] = useState<Service<Category[]>>({
    status: 'loading'
  });

  useEffect(() => {
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
      .then(response => setResult({ status: 'loaded', payload: response }))
      .catch(error => setResult({ status: 'error', error }));
  }, []);

  return result;
};

export default useCategoriesService;

'use client';

import { useAppContext } from '../context/contextData';
import Loading from './loading/loading';

const GlobalLoading = () => {
  const { loading } = useAppContext();

  return <Loading isLoading={loading} />;
};

export default GlobalLoading; 

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to shipments page
    navigate('/shipments');
  }, [navigate]);

  return null;
};

export default Index;

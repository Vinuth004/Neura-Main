import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const email = Cookies.get('email');

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  return email ? children : null;
}

export default PrivateRoute;

import { useState } from 'react';

let globalUserEmail = '';

const useAuth = () => {
  const [userEmail, setUserEmail] = useState(globalUserEmail);

  const setEmail = (email) => {
    globalUserEmail = email;
    setUserEmail(email);
  };

  return { userEmail, setEmail };
};

export default useAuth;
// components/AuthListener.tsx
import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { useAppDispatch } from '../redux/hooks';
import { setUser } from '../redux/slices/authSlice';

const AuthListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser(user.toJSON()));
      } else {
        dispatch(setUser(null));
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [dispatch]);

  return null;
};

export default AuthListener;
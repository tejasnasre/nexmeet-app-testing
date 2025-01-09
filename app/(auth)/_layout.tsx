import { Stack } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';
import { Redirect } from 'expo-router';

const AuthLayout = () => {
  const { isAuthenticated }: any = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }
  return <Stack />;
};

export default AuthLayout;

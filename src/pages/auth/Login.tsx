import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, selectAuthLoading, selectAuthError, clearError } from '../../store/features/auth/authSlice';
import type { LoginRequest } from '../../types/auth';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, FormField, Input, PasswordInput, ErrorMessage } from '../../components';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const data: LoginRequest = { email, password };
    const resultAction = await dispatch(loginThunk(data));

    if (loginThunk.fulfilled.match(resultAction)) {
      const role = resultAction.payload.role;
      if (role === 'DOCTOR') {
        navigate('/doctor-dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gradient drop-shadow-sm tracking-tight">YOUMED</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={error} className="mb-4" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField label="Email" required>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </FormField>

            <FormField label="Password" required>
              <PasswordInput
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </FormField>

            <Button type="submit" className="w-full mt-2" isLoading={loading}>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-600">
            Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Register here</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

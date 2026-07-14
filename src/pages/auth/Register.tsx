import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk, selectAuthLoading, selectAuthError, clearError } from '../../store/features/auth/authSlice';
import type { RegisterRequest } from '../../types/auth';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, FormField, Input, PasswordInput, ErrorMessage } from '../../components';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const serverError = useSelector(selectAuthError);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation cơ bản
    if (!fullName || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const data: RegisterRequest = { fullName, email, password };
    const resultAction = await dispatch(registerThunk(data));
    
    if (registerThunk.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  const displayError = localError || serverError;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gradient drop-shadow-sm tracking-tight">YOUMED</CardTitle>
          <CardDescription>Enter your details to register for YouMed</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={displayError} className="mb-4" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField label="Full Name" required>
              <Input 
                type="text" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)} 
                required 
                disabled={loading}
              />
            </FormField>
            
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
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={loading}
              />
            </FormField>
            
            <FormField label="Confirm Password" required>
              <PasswordInput 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                disabled={loading}
              />
            </FormField>

            <Button type="submit" className="w-full mt-2" isLoading={loading}>
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-600">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in here</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;

'use client'
import { SignInSchema, TsSignIn } from '@/store/authZodStore';
import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import SubmitButton from '@/components/pages/auth/SubmitButton';
import FormInput from '@/components/pages/auth/FormInput';
import Link from 'next/link';
import { baseInstance } from '@/constants/api';
import { useStaffStore } from '@/store/StaffStore';
import { useRouter, useSearchParams } from 'next/navigation';

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const methods = useForm<TsSignIn>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const { setData } = useStaffStore();
  const { handleSubmit, setError: setFieldError } = methods;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the redirect destination from URL params (set by middleware)
  const redirectTo = searchParams.get('redirectTo') || '/';

  const onSubmit = async (data: TsSignIn) => {
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        email: data.email,
        password: data.password
      };

      const response = await baseInstance.post("/staff/auth/login", payload);
      
      // Store staff data in your store
      setData(
        response.data.staff_info.id, 
        response.data.staff_info.email, 
        response.data.staff_info.name, 
        response.data.staff_info.role
      );

      console.log(`✅ Login successful, redirecting to: ${redirectTo}`);
      
      // Redirect to intended destination or dashboard home
      router.push(redirectTo);
      
    } catch (err: any) {
      console.error('❌ Login error:', err);
      
      // Handle different types of errors
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 422) {
        // Handle validation errors from backend
        const validationErrors = err.response.data?.detail;
        if (Array.isArray(validationErrors)) {
          validationErrors.forEach((error: any) => {
            if (error.loc?.includes('email')) {
              setFieldError('email', { message: error.msg });
            } else if (error.loc?.includes('password')) {
              setFieldError('password', { message: error.msg });
            }
          });
        } else {
          setError('Please check your input and try again');
        }
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.response?.data?.detail || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
      
      {/* Show redirect message if user was redirected from a protected page */}
      {redirectTo !== '/' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            Please sign in to access <strong>{redirectTo}</strong>
          </p>
        </div>
      )}

      {/* Show general error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-6'>
          <FormInput 
            label='Email' 
            name='email' 
            type='email'
            disabled={isLoading}
          />
          <FormInput 
            label='Password' 
            name='password' 
            type='password'
            disabled={isLoading}
          />

          <p className="text-sm text-gray-600">
            You don't have an account?{' '}
            <Link 
              href={"/sign-up"} 
              className='text-blue-500 hover:text-blue-700 underline'
            >
              Click here to Register as a Manager
            </Link>
          </p>

          <SubmitButton 
            text={isLoading ? 'Signing In...' : 'Sign In'} 
            disabled={isLoading}
          />
        </form>
      </FormProvider>

    </div>
  )
}

export default SignInPage
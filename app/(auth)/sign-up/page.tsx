'use client'
import React from 'react'
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod'
import SubmitButton from '@/components/pages/auth/SubmitButton';
import FormInput from '@/components/pages/auth/FormInput';
import { FormProvider, useForm } from 'react-hook-form';
import { SignUpSchema, TsSignUp } from '@/store/authZodStore';
import { baseInstance } from '@/constants/api';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const methods = useForm<TsSignUp>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })
  const { handleSubmit } = methods

  const router = useRouter()

  const onSubmit = async (data: TsSignUp) => {
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password
    }
    const response = await baseInstance.post("/staff/register-manager", payload)
    router.replace("/sign-in")
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-6'>
          <FormInput label='first name' name='firstName' />
          <FormInput label='last name' name='lastName' />
          <FormInput label='email' name='email' />
          <FormInput label='password' type='password' name='password' />
          <FormInput label='confirm password' type='password' name='confirmPassword' />

          <p> You already have an account? <Link href={"/sign-in"} className='text-blue-400'>Click here to Login</Link>  </p>

          <SubmitButton text='Register' />
        </form>
      </FormProvider>
    </div>
  )
}

export default SignUpPage
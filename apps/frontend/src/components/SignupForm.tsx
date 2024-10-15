import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Input } from 'rsuite'
import { SignupProps } from '../Types/FormProps'

const SignupForm: FC<SignupProps> = ({ formValues, handleSubmit, handleChange }) => {
    return (
        <div>
          <div className='flex justify-center items-center min-h-screen leading-8'>
            <div className='w-3/5 lg:w-1/3 border border-gray-200 rounded-md p-4 shadow-sm'>
                <div className='text-center'>
                    <h6>Sign up</h6>
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                    <div className='mb-2'>
                            <label htmlFor="username">Username</label>
                            <Input name='username' value={formValues.username} onChange={(value) => handleChange('username', value)} placeholder='Enter your username' />
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="email">Email address</label>
                            <Input name='email' value={formValues.email} onChange={(value) => handleChange('email', value)} placeholder='Enter your email address' />
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="password">Password</label>
                            <Input name='password' type='password' value={formValues.password} onChange={(value) => handleChange('password', value)} placeholder='Enter your password' />
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Input name='confirmPassword' type='password' value={formValues.confirmPassword} onChange={(value) => handleChange('confirmPassword', value)} placeholder='Enter your password again' />
                        </div>
                        <div className='flex justify-center'>
                            <button type='submit' className='px-7 text-white py-1 rounded-md bg-purple-800 hover:bg-purple-600'>Sign up</button>
                        </div>
                        <div>
                        <p className='text-xs'>Already have an account? <Link to={'/'} className='hover:no-underline'>Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>  
        </div>
    )
}

export default SignupForm
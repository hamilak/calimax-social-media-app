import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Input } from 'rsuite'
import { LoginProps } from '../Types/FormProps'

const LoginForm: FC<LoginProps> = ({ formValues, handleSubmit, handleChange }) => {
    return (
        <div>
          <div className='flex justify-center items-center min-h-screen leading-8'>
            <div className='w-3/5 lg:w-1/3 border border-gray-200 rounded-md p-4 shadow-sm'>
                <div className='text-center'>
                    <h6>Login</h6>
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-2'>
                            <label htmlFor="email">Email address</label>
                            <Input name='email' value={formValues.email} onChange={(value) => handleChange('email', value)} placeholder='Enter your email address' />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <Input name='password' type='password' value={formValues.password} onChange={(value) => handleChange('password', value)} placeholder='Enter your password' />
                        </div>
                        <div className='mb-2'>
                            <Link to={'/forgot-password'} className='text-xs text-red-600 hover:text-red-600 cursor-pointer hover:no-underline'>Forgot password?</Link>
                        </div>
                        <div className='flex justify-center'>
                            <button type='submit' className='px-7 text-white py-1 rounded-md bg-purple-800 hover:bg-purple-600'>Login</button>
                        </div>
                        <div>
                        <p className='text-xs'>Don't have an account? <Link to={'/signup'} className='hover:no-underline'>Sign up</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>  
        </div>
    )
}

export default LoginForm
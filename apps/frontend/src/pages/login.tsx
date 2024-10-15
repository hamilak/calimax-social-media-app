import { FC, FormEvent, useState } from 'react'
import LoginForm from '../components/LoginForm'
import { LoginFormValues } from '../Types/FormValues'
import { useAuth } from '../context/AuthContext'

const Login: FC = () => {
    const { login } = useAuth()
    const [formValues, setFormValues] = useState<LoginFormValues>({
        email: '',
        password: ''
    })

    const handleChange = (name: string, value: any) => {
        setFormValues((prevValue) => ({ ...prevValue, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        // const errors: FormErrors = {}
        // const emailError = validateEmail(formValues.email)
        // const passwordError = validatePassword(formValues.password)
        // if (emailError || passwordError) {
        //     errors.email = String(emailError)
        //     errors.password = String(passwordError)
        // }
        // setValidationErrors(errors)
        // if (Object.keys(errors).length === 0) {
            await login(formValues.email, formValues.password)
        // }
    }

  return (
    <div>
        <LoginForm formValues={formValues} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  )
}

export default Login
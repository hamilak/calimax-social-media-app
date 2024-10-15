import { FC, FormEvent, useState } from 'react'
import SignupForm from '../components/SignupForm'
import { SignupFormValues } from '../Types/FormValues'
import axios from 'axios'

const Signup: FC = () => {
    const [formValues, setFormValues] = useState<SignupFormValues>({
        email: '',
        password: '',
        username: '',
        confirmPassword: '',
        profilePicture: null
    })

    const handleChange = (name: string, value: any) => {
        setFormValues((prevValue) => ({ ...prevValue, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/user', formValues)
            console.log(response)
        } catch (error) {
            
        }
    }

  return (
    <div>
        <SignupForm formValues={formValues} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  )
}

export default Signup
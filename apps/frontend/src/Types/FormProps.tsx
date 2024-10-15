import { FormEvent } from "react";
import { LoginFormValues, SignupFormValues } from "./FormValues";

export interface LoginProps {
    formValues: LoginFormValues
    handleSubmit: (e: FormEvent) => void
    handleChange: (name: string, value: any) => void
}

export interface SignupProps {
    formValues: SignupFormValues
    handleSubmit: (e: FormEvent) => void
    handleChange: (name: string, value: any) => void
}
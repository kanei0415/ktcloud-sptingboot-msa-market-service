import AuthService from "@services/rest-api/auth-service"
import { useCallback, useState } from "react"
import SignUp from "../SignUp"

const SignUpContainer = () => {
  const { mutate: signup } = AuthService.useSignUp()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')


  const onSignUpButtonClicked = useCallback(() => {
    signup({ email, password, name })
  }, [email, password, name])

  const onEmailChanged = useCallback((newEmail: string) => {
    setEmail(newEmail)
  }, [])

  const onPasswordChanged = useCallback((newPassword: string) => {
    setPassword(newPassword)
  }, [])

  const onNameChanged = useCallback((newName: string) => {
    setName(name)
  }, [])

  return <SignUp
    onSignUpButtonClicked={onSignUpButtonClicked}
    onEmailChanged={onEmailChanged}
    onPasswordChanged={onPasswordChanged}
    onNameChanged={onNameChanged}
  />
}

export default SignUpContainer
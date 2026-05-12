import AuthService from "@services/rest-api/auth-service"
import Login from "../Login"
import { useCallback, useState } from "react"

const LoginConatiner = () => {
  const { mutate: signIn } = AuthService.useSignIn()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onLoginButtonClicked = useCallback(() => {
    signIn({ email, password })
  }, [email, password])

  const onEmailChanged = useCallback((newEmail: string) => {
    setEmail(newEmail)
  }, [])

  const onPasswordChanged = useCallback((newPassword: string) => {
    setPassword(newPassword)
  }, [])

  return <Login
    onLoginButtonClicked={onLoginButtonClicked}
    onEmailChanged={onEmailChanged}
    onPasswordChanged={onPasswordChanged}
  />
}

export default LoginConatiner
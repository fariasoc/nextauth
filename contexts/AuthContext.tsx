import { createContext, ReactNode, useState } from 'react'
import Router from 'next/router'
import { api } from '../services/api'

type User = {
  email: string
  permisions: string[]
  roles: string[]
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>
  user: User
  isAuthenticated: boolean
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData )

export function AuthProvider({children}) {
  const [user, setUser] = useState<User>()
  //const router = useRouter()
  const isAuthenticated = !!user

 async function signIn({email, password}: SignInCredentials){
   try {
    console.log({email, password})
    const response = await api.post('sessions', {
      email, 
      password,
    })
    console.log(response.data)

    const { token , refreshToken, permisions, roles } = response.data

    setUser({
      email, 
      permisions,
      roles,
    })

    Router.push('/dashboard')

  } catch(err){
    console.log(err);
  }

  }

  return (
    <AuthContext.Provider value={{signIn, isAuthenticated, user}} >
      {children}  
    </AuthContext.Provider>
  )
}
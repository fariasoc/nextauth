import { createContext, ReactNode, useEffect, useState } from 'react'
import { setCookie, parseCookies } from 'nookies'
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

  useEffect(() => { 
    const { 'nextauth.token': token } = parseCookies()
    if(token){
      api.get('/me').then(response => {
        console.log(response)
      })
    }
  }, [])

 async function signIn({email, password}: SignInCredentials){
   try {
    console.log({email, password})
    const response = await api.post('sessions', {
      email, 
      password,
    })
    console.log(response.data)

    const { token , refreshToken, permisions, roles } = response.data

    setCookie(undefined, 'nextauth.token', token, {
      maxAge: 60 * 60 * 24 * 30, // 30 dias 
      path: '/'
    })
    setCookie(undefined, 'nextauth.refreshToken', token, {
      maxAge: 60 * 60 * 24 * 30, // 30 dias 
      path: '/'
    })

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
export class AuthTokenError extends Error {
  constructor(){
    super('Erro de autenticação de token')
  }
}
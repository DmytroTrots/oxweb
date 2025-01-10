import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [client, setClient] = useState(null)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    setUser(storedUser)
    const storedClient = JSON.parse(localStorage.getItem('client'))
    setClient(storedClient)
  }, [])

  const getUser = () => {
    return JSON.parse(localStorage.getItem('user'))
  }

  const userIsAuthenticated = () => {
    return localStorage.getItem('user') !== null
  }

  const userLogin = user => {
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  const userLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const getClient = () => {
    return JSON.parse(localStorage.getItem('client'))
  }

  const setClientData = client => {
    localStorage.setItem('client', JSON.stringify(client))
    setClient(client)
  }

  const clearClient = () => {
    localStorage.removeItem('client')
    setClient(null)
  }

  const clearContext = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('client')
    setClient(null)
    setUser(null)
  }

  const contextValue = {
    user,
    getUser,
    userIsAuthenticated,
    userLogin,
    userLogout,
    client,
    getClient,
    setClientData,
    clearClient,
    clearContext
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

export function useAuth() {
  return useContext(AuthContext)
}

export { AuthProvider }
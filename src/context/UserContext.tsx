import { createContext, useContext, useState, useEffect } from 'react'
import type { UserDto } from '../types'

interface UserContextType {
  currentUser: UserDto | null
  setCurrentUser: (user: UserDto | null) => void
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserDto | null>(() => {
    const stored = localStorage.getItem('gymtracker_user')
    return stored ? JSON.parse(stored) : null
  })

  const setCurrentUser = (user: UserDto | null) => {
    setCurrentUserState(user)
    if (user) localStorage.setItem('gymtracker_user', JSON.stringify(user))
    else localStorage.removeItem('gymtracker_user')
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
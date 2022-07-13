// wrong!!! bad!!! do not do!!!

import { FormEvent, useEffect, useState } from "react";
import { firestore } from "../services/firebase";

type User = {
  id: string
  name: string
}

function transformUser(user) {
  return { id: user.id, ...user.data() }
}

function Index() {
  const [value, setValue] = useState('')
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function getUsers() {
      const response = await firestore.collection('users').get()
      const users = response.docs.map(transformUser)
      setUsers(users as User[])
    }

    getUsers()
  }, [])
  
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const newUser = { name: value }
    const response = await firestore.collection('users').add(newUser)
    setUsers(prevState => [...prevState, {id: response.id, ...newUser}])
    setValue('')
  }

  const updateUser = async (userId: string) => {
    const newMonkey = {name: 'Monkey'};
    await firestore.doc(`users/${userId}`).update(newMonkey)
    setUsers(prevState => prevState.map(user => user.id === userId ? {id: userId, ...newMonkey} : user))
  }
  
  const deleteUser = async (userId: string) => {
    await firestore.doc(`users/${userId}`).delete()
    setUsers(prevState => prevState.filter(user => user.id !== userId))
  }

  return (
    <div>
      <h1>Firebase workshop! 🚀</h1>
      <form onSubmit={onSubmit}>
        <input onChange={event => setValue(event.target.value)} value={value} type="text" />
        <button>submit</button>
      </form>
      <ul>
        {users.map(user => {
          return (
            <p key={user.id}>{user.name} 
              <button onClick={() => updateUser(user.id)}>turn into a monkey</button>
              <button onClick={() => deleteUser(user.id)}>x</button>
            </p>
          )
        })}
      </ul>
    </div>
  )
}

export default Index

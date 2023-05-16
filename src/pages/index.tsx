import { FormEvent, useEffect, useState } from "react"
import { firestore } from "../services/firebase";

function Index() {
  const [users, setUsers] = useState<any[]>([]);
  const [value, setValue] = useState('')

  useEffect(() => {
    async function getUsers(){
      // collections -> documents
      const snapshot = await firestore.collection('users').get()
      const data = snapshot.docs.map(item => ({ id: item.id, ...item.data() }))
      setUsers(data)
    }

    getUsers();
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newUser = await firestore.collection('users').add({name: value})
    setUsers(prevState => [...prevState, {id: newUser.id, name: value }])
    setValue('')
  }

  const handleDelete = async (userId: string) => {
    // deleting a document
    await firestore.doc(`users/${userId}`).delete();
    setUsers(prevState => prevState.filter(state => state.id !== userId))
  }
  
  return (
    <div>
      <h1>Firebase workshop! 🚀</h1>
      <form onSubmit={handleSubmit}>
        <input onChange={event => setValue(event.target.value)} value={value} type="text" />
        <button type="submit">create new user</button>
      </form>
      <ul>
        {users.map(user => <li key={user.id}>{user.name}<button onClick={() => handleDelete(user.id)} type="button">delete</button></li>)}
      </ul>
    </div>
  )
}

export default Index

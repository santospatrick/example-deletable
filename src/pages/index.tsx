import React, { FormEvent, useState } from 'react'
import { firestore } from '../services/firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

type Props = {}

type User = {
  id: string
  age: number
  name: string
}

function Index({}: Props) {
  const [users = [], loading, error] = useCollectionData<User>(firestore.collection('users'), {
    idField: 'id'
  })
  const [value, setValue] = useState('')

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const onDeleteUser = async (id: string) => {
    await firestore.collection('users').doc(id).delete()
  }
  
  const onEdit = async (id: string) => {
    const name = prompt('Enter new name')
    if (!name) {
      return
    }
    await firestore.collection('users').doc(id).update({ name })
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await firestore.collection('users').add({ name: value })
    setValue('')
  }

  return (
    <div>
      <h1>Users</h1>
      <form onSubmit={onSubmit}>
        <input type="text" onChange={event => setValue(event.target.value)} value={value} />
        <button>submit</button>
      </form>
      <ul>
        {users.map(({ id, name }) => (
          <li key={id}>
            <span>{name}</span>
            <button type='button' onClick={() => onDeleteUser(id)}>x</button>
            <button type="button" onClick={() => onEdit(id)}>edit</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Index
import React, { useEffect, useState } from 'react'
import { firestore } from '../services/firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore'

type User = {
  id: string
  name: string
}

function Index() {
  const [text, setText] = useState('')
  const [isEditingId, setIsEditingId] = useState('')
  const [values = [], loading, error] = useCollectionData<User>(firestore.collection('users'), {
    idField: 'id'
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (isEditingId) {
      await firestore.collection('users').doc(isEditingId).update({ name: text })
      setIsEditingId('')
      setText('')
    } else {
      await firestore.collection('users').add({ name: text })
    }
    
    setText('')
  }

  const onDelete = async (id: string) => {
    await firestore.collection('users').doc(id).delete()
    console.log('user deleted successfully')
  }

  const onEdit = async (id: string) => {
    setIsEditingId(id)
    setText(values.find(user => user.id === id)?.name || '')
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>An error has occurred.</div>
  }

  return (
    <div>
      <ul>
        {values.map(user => (<li key={user.id}>{user.name} <button onClick={() => onEdit(user.id)}>edit</button> <button onClick={() => onDelete(user.id)}>delete</button></li>))}
      </ul>
      <form onSubmit={handleSubmit} noValidate>
        <input onChange={event => setText(event.target.value)} value={text} type="text" />
        <button>submit</button>
      </form>
    </div>
  )
}

export default Index
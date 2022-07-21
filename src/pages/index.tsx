import { FormEvent, useMemo, useState } from "react";
import { firestore } from "../services/firebase";
import { useCollection } from 'react-firebase-hooks/firestore';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

type User = {
  id: string
  name: string
}

// the right thing to do is use these values as environment variables
const searchClient = algoliasearch('QLWCLDVRIV', '32592c31b33082885bac48d861cd0158');

function transformUser(user) {
  return { id: user.id, ...user.data() }
}

function Index() {
  const [value, setValue] = useState('')
  const [data, loading, error] = useCollection<User>(firestore.collection('users'))
  console.log("🚀 ~ file: index.tsx ~ line 22 ~ Index ~ data", data)

  const users = useMemo(() => {
    return data?.docs.map(transformUser)
  }, [data])
  
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const newUser = { name: value }
    const response = await firestore.collection('users').add(newUser)
    setValue('')
  }

  const updateUser = async (userId: string) => {
    const newMonkey = {name: 'Monkey'};
    await firestore.doc(`users/${userId}`).update(newMonkey)
  }
  
  const deleteUser = async (userId: string) => {
    await firestore.doc(`users/${userId}`).delete()
  }

  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return `An error has occured: ${error.message}`
  }

  return (
    <div>
      <h1>Firebase workshop! 🚀</h1>
      <form onSubmit={onSubmit}>
        <input onChange={event => setValue(event.target.value)} value={value} type="text" />
        <button>submit</button>
      </form>
      <ul>
        {users?.map(user => {
          return (
            <p key={user.id}>{user.name} 
              <button onClick={() => updateUser(user.id)}>turn into a monkey</button>
              <button onClick={() => deleteUser(user.id)}>x</button>
            </p>
          )
        })}
      </ul>
      <InstantSearch searchClient={searchClient} indexName="users">
        <SearchBox />
        <Hits hitComponent={props => <div>{props.hit.name}</div>} />
      </InstantSearch>
    </div>
  )
}

export default Index

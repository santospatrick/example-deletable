import algoliasearch from 'algoliasearch';
import React from 'react'
import { Configure, Hits, InstantSearch, SearchBox } from 'react-instantsearch-dom';
import { firestore } from '../services/firebase';

const searchClient = algoliasearch('4HWSN0DAZY', 'd5257b78ed476d469046e7da06c0620d');

type Props = {
  hit: any
}

function Hit({ hit }: Props) {
  const onDelete = async (id: string) => {
    await firestore.collection('users').doc(id).delete();
  }

  return <div>{hit.name} <button onClick={() => onDelete(hit.objectID)}>delete</button> </div>
}

function Index() {
  return (
    <InstantSearch searchClient={searchClient} indexName='users'>
      <SearchBox />
      <Hits hitComponent={Hit} />
      <Configure filters="organizationId:123" />
    </InstantSearch>
  )
}

export default Index
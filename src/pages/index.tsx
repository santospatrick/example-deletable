import algoliasearch from 'algoliasearch';
import React, { useCallback, useState } from 'react'
import { firestore } from '../services/firebase';
import { Configure, InstantSearch, useHits, useSearchBox } from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch('4HWSN0DAZY', 'd5257b78ed476d469046e7da06c0620d');

type Props = {
  hit: any
  onDelete: (id: string) => void
}
import { useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cleanup function
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

function Hit({ hit, onDelete }: Props) {
  return <div>{hit.name} <button onClick={() => onDelete(hit.objectID)}>delete</button> </div>
}

function SearchPage() {
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [value, setValue] = useState('')
  const debouncedSearchTerm = useDebounce(value, 500);

  const { refine } = useSearchBox();

  useEffect(() => {
    refine(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  const transformItems = useCallback((items: any) => items.filter((item: any) => !deletedIds.includes(item.objectID)), [deletedIds])

  const { hits } = useHits({
    transformItems
  });

  const onDelete = async (id: string) => {
    try {
      setDeletedIds(prevState => [...prevState, id])
      await firestore.collection('users').doc(id).delete();
    } catch {
      // revert the deletion
    }
  }

  return (
    <>
      <input onChange={e => setValue(e.target.value)} value={value} />
      {hits.map(hit => <Hit key={hit.objectID} hit={hit} onDelete={onDelete} />)}
      <Configure />
    </>
  )
}

function Index() {
  return (
    <InstantSearch searchClient={searchClient} indexName='users'>
      <SearchPage />
    </InstantSearch>
  )
}

export default Index
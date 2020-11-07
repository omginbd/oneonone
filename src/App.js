import { QueryCache, ReactQueryCacheProvider, useQuery } from 'react-query';

import Flippy from './Flippy'
import './App.css';
import { useState } from 'react';

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

function App() {
  const { isLoading: isLoadingPeople, data: people, refetch: refetchPeople } = useQuery('people', () =>
    fetch('https://mpc-oneonone.builtwithdark.com/people').then(res => res.json())
  )
  const { isLoading: isLoadingPairs, isFetching: isFetchingPairs, data, refetch: refetchPairs } = useQuery('generate', () =>
    fetch('https://mpc-oneonone.builtwithdark.com/generate').then(res => {
      if (res.status === 200) return res.json()
      throw new Error("Error while fetching pairs")
    }), {
      retry: true,
      retryDelay: 100
    }
  )
  const [newPersonName, setNewPersonName] = useState(-1)

  const addPerson = () => {
    const request = new Request('https://mpc-oneonone.builtwithdark.com/people', {
      method: 'POST',
      body: JSON.stringify({ name: newPersonName }),
      headers: { 'Content-Type': 'application/json' }
    })

    fetch(request).then(() => {
      refetchPeople()
      setNewPersonName(-1)
    })
  }

  const deletePerson = person => {
    const request = new Request(`https://mpc-oneonone.builtwithdark.com/people/${person.name}`, {
      method: 'DELETE',
    })

    fetch(request).then(() => {
      refetchPeople()
    })
  }

  const toggleActive = person => {
    const request = new Request(`https://mpc-oneonone.builtwithdark.com/people/${person.name}`, {
      method: 'PATCH',
      body: JSON.stringify({ active: !person.active }),
      headers: { 'Content-Type': 'application/json' }
    })

    fetch(request).then(() => {
      refetchPeople()
    })
  }

  return (
    <div className="App">
      <Flippy
        front={
          <>
            <header className="App-header">
              <button disabled={isLoadingPairs || isFetchingPairs} onClick={refetchPairs}>Generate New One on One</button>
            </header>
            {data && (
              <div className="App-pairs">
                {Object.keys(data.pairs).map((key, i) => (<div key={i}>{key} - {data.pairs[key]}</div>))}
              </div>
            )}
          </>
        }
        back={
          <>
            {people && (
              <>
                {Object.keys(people).sort().map((person, i) => (
                  <div className="flex edges" key={i} style={{ backgroundColor: i % 2 === 0 ? 'rgba(0, 0, 0, 0.2)' : '', padding: '4px' }}>
                    {person} <span><span onClick={() => toggleActive(people[person])}>{people[person].active ? "😴" : "⏰"}</span> <span onClick={() => deletePerson(people[person])}>❌</span></span>
                  </div>
                ))}
                {newPersonName === -1 && <div className="App-new-person" onClick={() => setNewPersonName('')}>+ New Person</div>}
                {newPersonName !== -1 && (
                  <input
                    disabled={isLoadingPeople}
                    value={newPersonName}
                    onChange={e => setNewPersonName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' ? addPerson() : ''}
                  />
                )}
              </>
            )}
          </>
        }
      />
    </div>
  );
}

function Wrapper() {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <App />
    </ReactQueryCacheProvider>
  )
}

export default Wrapper
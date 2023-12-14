import { useState, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { loadRootTree } from './reducers/rootTreeReducer';
import { loadAllAccessories } from './reducers/allAccessoriesReducer';
import { accessories as allAccessories, root as rootTree} from "./avatar.json";

function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    dispatch(loadAllAccessories(allAccessories))
    dispatch(loadRootTree(rootTree))
  }, [dispatch])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

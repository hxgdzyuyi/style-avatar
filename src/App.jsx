import { useState, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import reactLogo from './assets/react.svg'
import { loadRootTree } from './reducers/rootTreeReducer';
import { loadAllAccessories } from './reducers/allAccessoriesReducer';
import { accessories as allAccessories, root as rootTree} from "./avatar.json";
import AvatarCanvas from './components/AvatarCanvas'

function App() {
  const dispatch = useDispatch()
  const currentRootTree = useSelector((state) => state.rootTree)

  useLayoutEffect(() => {
    dispatch(loadAllAccessories(allAccessories))
    dispatch(loadRootTree(rootTree))
  }, [dispatch])

  if (!currentRootTree) {
    return null
  }

  return (
    <><AvatarCanvas accessoryKeys={["eyes_eyes4_part2_pink"]}/></>
  )
}

export default App

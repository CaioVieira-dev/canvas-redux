import { useSelector } from 'react-redux';

import Canvas from './components/Canvas/Canvas'
import {selectDraw} from './features/draw/drawSlice'

function App() {
  const drawState = useSelector(selectDraw)


  return (
    <div className="App">
      <Canvas draw={drawState.rectangles}/>
    </div>
  );
}

export default App;

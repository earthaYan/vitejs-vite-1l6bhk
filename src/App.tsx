import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, createDndContext } from 'react-dnd';
import Demo from './Demo';

const DndContext = createDndContext(HTML5Backend);

const App = () => {
  const manager = React.useRef(DndContext);
  return (
    <>
      <DndProvider manager={manager.current.dragDropManager as any}>
        <Demo/>
      </DndProvider>
    </>
  );
};

export default App;

import React from 'react';
import Table from './Table';

function App() {
  
  const [currentDepartment, setCurrentDepartment] = React.useState(-1);

  return(
    <Table currentDepartment={currentDepartment} setCurrentDepartment={setCurrentDepartment}/>
  )

}

export default App;

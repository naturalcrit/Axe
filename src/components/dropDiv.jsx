import React from 'react';
import GridLayout from "react-grid-layout";


const DropDiv = () => {
  const layout = [
    { i: 'a', x: 0, y: 0, w: 2, h: 2 },
    { i: 'b', x: 2, y: 0, w: 2, h: 2 },
    { i: 'c', x: 4, y: 0, w: 2, h: 2 }
  ];
  
  return (
    <div>
        <GridLayout className="layout" layout={layout} cols={6} rowHeight={100} width={1200}>
          <div key="a">A</div>
          <div key="b">B</div>
          <div key="c">C</div>
        </GridLayout>
    </div>
  );
};

export default DropDiv;

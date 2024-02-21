import React from 'react';
import { useDrop } from "react-dnd";

const DropDiv = ({type, items}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  console.log(items);
  if (items.length === 0) {
    <div 
      ref={drop}
      className={`drop-div ${isOver ? "drop-over" : ""}`}
      >
      </div>
  }
  return (
    <div 
      ref={drop}
      className={`drop-div ${isOver ? "drop-over" : ""}`}
      >
        {items.map((item) => {
          return <div className="item" key={item.id}>{item.content}</div>
        })}
      </div>
  );
};

export default DropDiv;

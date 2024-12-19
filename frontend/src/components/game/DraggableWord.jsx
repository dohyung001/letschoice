// DraggableWord.js
import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const DraggableWord = ({ word, index }) => (
  <Draggable draggableId={word} index={index}>
    {(provided, snapshot) => (
      <WordButton
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        isDragging={snapshot.isDragging}
      >
        {word}
      </WordButton>
    )}
  </Draggable>
);

export default DraggableWord;

const WordButton = styled.div`
  background-color: #b0b0b0;
  height: 40px;
  padding: 10px 20px;
  margin:0px 10px 0px 10px;
  border-radius: 5px;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};

`;

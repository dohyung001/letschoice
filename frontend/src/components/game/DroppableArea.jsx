import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import DraggableWord from './DraggableWord';

const DroppableArea = ({ id, items }) => (
  <Droppable droppableId={id} direction="horizontal">
    {(provided) => (
      <Container ref={provided.innerRef} {...provided.droppableProps}>
        {items.map((item, index) => (
          <DraggableWord key={item} word={item} index={index} />
        ))}
        {provided.placeholder}
      </Container>
    )}
  </Droppable>
);

export default DroppableArea;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  border:2px solid gray;
  border-radius: 5px;
  align-items:center;
  `;

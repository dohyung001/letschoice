import React from 'react';
import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableWord = ({ word }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: word.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <WordButton ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {word.text}
    </WordButton>
  );
};

export default SortableWord;

const WordButton = styled.div`
  background-color: #b0b0b0;
  height: 40px;
  padding: 10px 20px;
  margin: 0px 10px 0px 10px;
  border-radius: 5px;
  opacity: 1;
  transition: all 0.3s ease;

  &:hover {
    filter: brightness(0.8);
    transition: filter 0.2s ease;
    cursor: pointer;
  }
`;

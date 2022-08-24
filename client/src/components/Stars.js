import React from 'react';
import styled from 'styled-components';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { CgLayoutGrid } from 'react-icons/cg';
const Stars = ({ stars = 0, reviews }) => {
  let tempArr = Array.from({ length: 5 }, (_, index) => {
    const roundUp = index + 0.75;
    const roundDown = index + 0.25;
    return (
      <span key={index}>
        {stars > roundUp ? (
          <BsStarFill />
        ) : stars < roundDown ? (
          <BsStar />
        ) : (
          <BsStarHalf />
        )}
      </span>
    );
  });

  return (
    <Wrapper>
      <div className='stars'>{tempArr}</div>
      <p className='reviews'>{reviews?.length} reviews</p>
      {/* <p className='reviews'>{reviews} reviews</p> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  span {
    color: #ffb900;
    font-size: 1rem;
    margin-right: 0.25rem;
  }
  p {
    margin-left: 0.5rem;
    margin-bottom: 2.5px;
  }
  margin-bottom: 0.5rem;
`;
export default Stars;

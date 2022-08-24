import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { useCartContext } from '../context/cart_context';
import AmountButtons from './AmountButtons';
import { CgLaptop } from 'react-icons/cg';

const AddToCart = ({ product }) => {
  const { id, stock, colors } = product;
  const [count, setCount] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);
  const { addToCart } = useCartContext();

  const increment = () => {
    if (count === stock) {
      return;
    }
    setCount(count + 1);
  };
  const decrement = () => {
    if (count === 1) {
      return;
    }
    setCount(count - 1);
  };

  return (
    <Wrapper>
      <div className='colors'>
        <span>colors : </span>
        <div>
          {colors.map((color, index) => {
            return (
              <button
                key={index}
                className={
                  index === colorIndex ? 'active color-btn' : 'color-btn'
                }
                style={{ backgroundColor: color }}
                onClick={() => setColorIndex(index)}
              >
                {index === colorIndex && <FaCheck />}
              </button>
            );
          })}
        </div>
      </div>

      <div className='btn-container'>
        <AmountButtons
          quantity={count}
          increment={increment}
          decrement={decrement}
        />
        <Link
          onClick={() =>
            addToCart({ id, count, color: colors[colorIndex], product })
          }
          to='/cart'
          className='btn'
        >
          add to cart
        </Link>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin-top: 2rem;
  .colors {
    display: grid;
    grid-template-columns: 125px 1fr;
    align-items: center;
    margin-bottom: 1rem;
    span {
      text-transform: capitalize;
      font-weight: 700;
    }
    div {
      display: flex;
    }
  }
  .color-btn {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: #222;
    margin-right: 0.5rem;
    border: none;
    cursor: pointer;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 0.75rem;
      color: var(--clr-white);
    }
  }
  .active {
    opacity: 0.9;
  }
  .btn-container {
    margin-top: 2rem;
  }

  .btn {
    margin-top: 1rem;
    width: 140px;
  }
  a {
    text-align: center;
  }
`;
export default AddToCart;

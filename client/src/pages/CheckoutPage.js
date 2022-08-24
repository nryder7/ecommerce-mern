import React from 'react';
import styled from 'styled-components';
import { PageHero, StripeCheckout } from '../components';
import { useCartContext } from '../context/cart_context';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart } = useCartContext();
  return (
    <main>
      <PageHero title='checkout' />;
      {cart.length < 1 ? (
        <div className='empty'>
          <h2>cart is empty</h2>
          <Link to='/products'>view products</Link>
        </div>
      ) : (
        <StripeCheckout />
      )}
    </main>
  );
};

const Wrapper = styled.div``;
export default CheckoutPage;

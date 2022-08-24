import React, { useState } from 'react';
import styled from 'styled-components';

const ProductImages = ({ image }) => {
  const [currIndex, setCurrIndex] = useState(0);

  if (image) {
    // const { url, filename } = images[currIndex];
    const images = [image, image, image];
    // const images = [image, image, image, image, image];
    return (
      <Wrapper>
        <img src={image} className='img' />
        {/* <img src={url} alt={filename} className='img' /> */}
        <div className='gallery'>
          {images.map((image, index) => {
            {
              /* const { url, filename } = image; */
            }
            return (
              <img
                onClick={() => setCurrIndex(index)}
                className={`${index === currIndex ? 'active' : null}`}
                key={index}
                // src={url}
                src={image}
                // alt={filename}
                alt={image}
              />
            );
          })}
        </div>
      </Wrapper>
    );
  }
  return <></>;
};

const Wrapper = styled.section`
  .main {
    height: 600px;
  }
  img {
    width: 100%;
    display: block;
    border-radius: var(--radius);
    object-fit: cover;
  }
  .gallery {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 1rem;
    img {
      height: 100px;
      cursor: pointer;
    }
  }
  .active {
    box-shadow: 0px 0px 0px 2px var(--clr-primary-5);
  }
  @media (max-width: 576px) {
    .main {
      height: 300px;
    }
    .gallery {
      img {
        height: 50px;
      }
    }
  }
  @media (min-width: 992px) {
    .main {
      height: 500px;
    }
    .gallery {
      img {
        height: 75px;
      }
    }
  }
`;

export default ProductImages;

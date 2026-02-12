import React from 'react';

export default function ImageSlot({ variant, tone, style }) {
  return (
    <div
      className={`image-slot image-slot--${variant || 'default'} image-slot--${tone || 'default'}`}
      style={{
        position: 'absolute',
        inset: 0,
        ...style
      }}
    />
  );
}

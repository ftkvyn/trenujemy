import React from 'react';

const DishInfo = (props) => (
  <span>
    {`B: ${Math.round(props.protein || 0)} g, T: ${Math.round(props.fat || 0)} g, W: ${Math.round(props.carbohydrate || 0)} g, K: ${Math.round(props.calories || 0)} kCal`}
  </span>
)

export default DishInfo;
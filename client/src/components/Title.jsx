import React from 'react';

const Title = ({ name }) => (
  <div className="recommendations-title">More Restaurants {name ? `Near ${name}`: '...'}</div>
);

export default Title;
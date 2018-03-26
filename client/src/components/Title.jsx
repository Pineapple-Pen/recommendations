import React from 'react';

const Title = ({ name }) => (
  <div className="recommendations-title">More Restaurants Nearby {name ? name : '...'}</div>
);

export default Title;
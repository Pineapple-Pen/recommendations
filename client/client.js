import React from 'react'
import Recommendations from './src/index.jsx';
import ReactDOM from 'react-dom';

window.Recommendations = Recommendations;
ReactDOM.render(<Recommendations />, document.getElementById('Recommendations') );

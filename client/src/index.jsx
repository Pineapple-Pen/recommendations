import React from 'react';
import ReactDOM from 'react-dom';
import RestaurantCard from './components/RestaurantCard.jsx';
import Title from './components/Title.jsx'
import $ from 'jquery';
import '../dist/styles.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recommended: [],
      restaurant: null,
    };
  }

  componentDidMount() {
    this.getRecommendedRestaurants();
  }

  getRecommendedRestaurants() {
    console.log(window.location.href);
    let id = window.location.href.split('/')[4] || 0;
    console.log(`getting recommended restaurants for id: ${id}`);

    $.ajax({
      url: `/api/restaurants/${id}/recommendations`,
      method: 'GET',
      success: (data) => {
        console.log('get success from client!', data);
        this.setState({
          restaurant: data[0],
          recommended: data.slice(1),
        });
      },
      error: (data) => {
        console.log('get error from client!', data);
      },
    });
  }

  goToRestaurant(id) {
    console.log(`go to restaurant ${id}`);
    location.href = `/restaurants/${id}`;
  }

  render() {
    return (
      <div>
        <Title name={this.state.restaurant ? this.state.restaurant.rest_name : null} />
        <div className="recommendations-container">
          {this.state.recommended.map((restaurant, index) => (
            <RestaurantCard restaurant={restaurant} key={index} switchRestaurant={this.goToRestaurant.bind(this)} />
          ))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('recommendations-app'));

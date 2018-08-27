import React, {Component}   from 'react';
import CheckoutSummary      from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route}              from 'react-router-dom';
import ContactData          from './ContactData/ContactData';

class Checkout extends Component {
    state = {
        ingredients:{},
        price:0
    }
    componentWillMount() {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        var price = 0;
        for(var param of query.entries()){
            if(param[0]==='price'){
                price = param[1];
            }else{
                ingredients[param[0]] = +param[1];
            }
        }
        this.setState({
            ingredients:ingredients,
            price:price
        });
        console.log(this.state);

    }

    checkoutCancelledHandle = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandle = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render(){
        return(
            <div>
                <CheckoutSummary 
                    checkoutCancelled={this.checkoutCancelledHandle}
                    checkoutContinued={this.checkoutContinuedHandle}
                    ingredients={this.state.ingredients} />
                <Route
                    component={(props) => (
                        <ContactData 
                            ingredients={this.state.ingredients} 
                            price={this.state.price} 
                            {...props} />  
                    )}
                    path={this.props.match.path + '/contact-data'} />
            </div>
        )
    }
}

export default Checkout;
import React, {Component}    from 'react';
import {connect}             from 'react-redux';
import axios                 from 'axios';
import classes               from './Orders.css';
import Order                 from '../../components/Order/Order';
import Spinner               from '../../components/UI/Spinner/Spinner';
import withErrorHandler      from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions          from '../../store/actions/index';
class Orders extends Component{
    componentDidMount() {
        this.props.onFetchOrders();
    }
    render() {
        let orders = <Spinner />;
        if(!this.props.loading){
            orders = this.props.orders.map(order =>(
                        <Order 
                            ingredients={order.ingredients}
                            price={order.price}
                            key={order.id} />
                    ))
        }
        return orders;
    }
 }
 const mapStatetoProps = state => {
     return {
         orders:state.order.orders,
         loading:state.order.loading
     }
 }
 const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: () => dispatch(actions.fetchOrders())
    };
 }
export default connect(mapStatetoProps,mapDispatchToProps)(withErrorHandler(Orders,axios));
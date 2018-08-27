import React, {Component}    from 'react';
import classes               from './Orders.css';
import Order                 from '../../components/Order/Order';
import axios                 from 'axios';
import withErrorHandler      from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component{
    state = {
        orders: [],
        loading:true
    };
    componentDidMount() {
        axios.get('https://react-my-burger-1840c.firebaseio.com/orders.json')
            .then (res => {
                var fetchedOrders = [];
                for(var key in res.data){
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    })
                };
                console.log(fetchedOrders);
                this.setState({
                    loading:false,
                    orders:fetchedOrders
                });
            })
            .catch(err=>{
                this.setState({loading:false})
            })

    };
    render() {
        return(
            <div>
                {this.state.orders.map(order =>(
                    <Order 
                        ingredients={order.ingredients}
                        price={order.price}
                        key={order.id} />
                ))}
            </div>
        );
    }
 }
export default withErrorHandler(Orders,axios);
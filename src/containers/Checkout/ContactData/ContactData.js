import React, {Component}   from 'react';
import Button               from '../../../components/UI/Button/Button';
import Spinner              from '../../../components/UI/Spinner/Spinner';
import classes              from './ContactData.css';
import axios                from '../../../axios-orders';
class ContactData extends Component {
    state = {
        loading:false, 
        customer: {
            name: '',
            adress: {
                street: '',
                zipCode: '',
                country: ''
            },
            email: ''
        }
    }
    orderHandler = (event) => { //concludi l'ordine
        event.preventDefault();
        this.setState({loading:true})
        const order = { //dati dell'ordine
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: '',
                adress: {
                    street: '',
                    zipCode: '',
                    country: ''
                },
                email: ''
            },
            deliveryMethod: ''
        }

        //invio dati al database 
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({
                    loading:false
                });
                this.props.history.push('/'); //ritorna in homepage una volta completato l'ordine
                console.log(response);
            })
            .catch(error => {
                this.setState({
                    loading:false
                });
                console.log(error);
            });
    }
    render(){
        var form = (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your E-mail" />
                <input className={classes.Input} type="text" name="street" placeholder="Your Street" />
                <input className={classes.Input} type="text" name="postalcode" placeholder="Your Postal Code" />
                <input className={classes.Input} type="text" name="country" placeholder="Your Country" />
                <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
            </form>
        );
        if(this.state.loading) {
            form = <Spinner />
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData
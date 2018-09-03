import React, {Component}   from 'react';
import {connect}            from 'react-redux';
import classes              from './ContactData.css';
import axios                from '../../../axios-orders';
import Button               from '../../../components/UI/Button/Button';
import Spinner              from '../../../components/UI/Spinner/Spinner';
import Input                from '../../../components/UI/Input/Input';
import withErrorHandler     from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions         from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        loading:false, 
        formIsValid:false,
        orderForm:{
            name: {
                element:'input',
                config: {
                    type:'text',
                    placeholder:'Your Name'
                },
                value:'',
                validation: {
                    required:true,
                    minLength:5,
                    maxLength:15
                },
                valid:false,
                touched:false
            },
            street: {
                element:'input',
                config: {
                    type:'text',
                    placeholder:'Your Street'
                },
                value:'',
                validation: {
                    required:true,
                    minLength:5,
                    maxLength:25
                },
                valid:false,
                touched:false
            },
            zipCode: {
                element:'input',
                config: {
                    type:'number',
                    placeholder:'Your Zip Code'
                },
                value:'',
                validation: {
                    required:true,
                    minLength:5,
                    maxLength:10
                },
                valid:false,
                touched:false
            },
            country: {
                element:'input',
                config: {
                    type:'text',
                    placeholder:'Your City'
                },
                value:'',
                validation: {
                    required:true,
                    minLength:5,
                    maxLength:15
                },
                valid:false,
                touched:false
            },
            email: {
                element:'input',
                config: {
                    type:'email',
                    placeholder:'Your email'
                },
                value:'',
                validation: {
                    required:false,
                },
                valid:true
            },
            deliveryMethod: {
                element:'select',
                config: {
                    options:[
                        {value:'cash on delivery', displayValue: 'Cash on delivery'},
                        {value:'credit card', displayValue: 'Credit card'},
                    ]
                },
                value:'',
                validation: {
                    required:true,
                },
                valid:true
            }
        }
    }
    validation(value,rules){
        var isValid = true; //trick per la somma delle condizioni di validità
        if(!rules){
            return true;
        }
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        };
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }
    inputChangedHandler = (event, inputIdentifier) =>  { //gestione contenuto form per la spedizione
        const updatedDeliveryForm = {...this.state.orderForm}
        const updateElement = {...updatedDeliveryForm[inputIdentifier]}
        updateElement.value = event.target.value
        updateElement.valid = this.validation(updateElement.value, updateElement.validation);
        updateElement.touched = true;
        updatedDeliveryForm[inputIdentifier] = updateElement;

        //server per tenere disattivato il bottone di submit affinchè l'iterno form non sia completamente validato
        var formIsValid = true;
        for(var inputIdentifier in updatedDeliveryForm) {
            formIsValid = updatedDeliveryForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({
            formIsValid: formIsValid,
            orderForm : updatedDeliveryForm
        });
    }
    orderHandler = (event) => { //concludi l'ordine
        event.preventDefault();
        const dataDelivery = {};
        for(var formElementIdentifier in this.state.orderForm) {
            dataDelivery[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        } 
        const order = { //dati dell'ordine
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: dataDelivery
        }
        this.props.onOrderBurger(order);
    }
    render(){
        const formElementsArray = [];
        for(var key in this.state.orderForm) {
            formElementsArray.push({    
                id:key, //IDENTIFICATIVO
                configuration:this.state.orderForm[key]
            })
        };
        var form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement =>(
                    <Input 
                        key ={formElement.id} //IDENTIFICATIVO
                        changed = {(event) => this.inputChangedHandler(event,formElement.id)}
                        invalid = {!formElement.configuration.valid} //LA VALIDAZIONE E' ANDATA A BUON FINE??
                        shouldValidate ={formElement.configuration.validation} //IL CAMPO E' OBBLIGATORIO?
                        touched = {formElement.configuration.touched}
                        elementConfig = {formElement.configuration.config}
                        value = {formElement.configuration.config}
                        elementType = {formElement.configuration.element} />
                ))}
                <Button 
                    btnType = "Success"
                    disabled = {!this.state.formIsValid}
                    clicked = {this.orderHandler}
                >
                        Order
                </Button>
            </form>
        );
        if(this.props.loading) {
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

const mapStateToProps =  state  => {
    return {
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice,
        loading:state.order.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData)  => dispatch(actions.purchaseBurger(orderData))
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData, axios));
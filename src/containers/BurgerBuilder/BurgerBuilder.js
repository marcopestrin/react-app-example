import React, {Component}   from 'react';
import {connect}            from 'react-redux';
import  * as actionTypes    from '../../store/actions';
import Aux                  from '../../hoc/Aux/Aux';
import withErrorHandler     from '../../hoc/withErrorHandler/withErrorHandler';
import axios                from '../../axios-orders';
import Burger               from '../../components/Burger/Burger';
import BuildControls        from '../../components/Burger/BuildControls/BuildControls'
import OrderSummary         from '../../components/Burger/OrderSumary/OrderSummary';
import Spinner              from '../../components/UI/Spinner/Spinner';
import Modal                from '../../components/UI/Modal/Modal';

const INGREDIENTS_PRICE = { //prezzo di ogni singolo ingrediente
    salad:0.4,
    cheese:0.5,
    meat:1.3,
    bacon:0.6
};

class BurgerBuilder extends Component {
    state = {
        loading:false,
        purchasing:false,
        error:false
    }

    componentDidMount () {
        /*
        axios.get("https://react-my-burger-1840c.firebaseio.com/ingredients.json")
            .then(response => {
                this.setState({ingredients:response.data});
            })
            .catch(error => {
                this.setState({error:true});
            });
        */
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey =>{
                return ingredients[igKey]
            })
            .reduce((sum,el)=>{
                return sum + el
            })
        return sum > 0
    }

    purchaseHandle = () => { //modal visibile
        this.setState({purchasing:true})
    }

    purchaseCancelHandle = () => { //rimuovi modal
        this.setState({purchasing:false})
    }

    purchaseContinueHandle = () => { //vai a checkout
           this.props.history.push('/checkout');
    };

    render() {
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
        let orderSummary= null

        const disabledInfo = {
            ...this.props.ings
        }
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        if(this.props.ings){ 
            //una volta che si sono caricati i dati degli ingredienti iniziali, viene rimosso lo spinner
            burger = (
                    <Aux>
                        <Burger ingredients={this.props.ings} />
                        <BuildControls
                            ordered={this.purchaseHandle}
                            disabled={disabledInfo} 
                            price ={this.props.price}
                            purchaseable={this.updatePurchaseState(this.props.ings)}
                            ingredientAdded={this.props.onIngredientAdded}
                            ingredientRemoved={this.props.onIngredientRemoved} />
                    </Aux>
                    );
            orderSummary = <OrderSummary 
                                ingredients={this.props.ings}
                                price={this.props.price}
                                purchaseCancelled={this.purchaseCancelHandle}
                                purchaseContined={this.purchaseContinueHandle} />
        }


        
        if(this.state.loading) {
            orderSummary = <Spinner />
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandle}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}
const mapStateToProps = state => {
    return {
        ings:state.ingredients,
        price:state.totalPrice
    };
}
console.log('mapStateToProps:',mapStateToProps);
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({
            type : actionTypes.ADD_INGREDIENT,
            ingredientName: ingName
        }),
        onIngredientRemoved: (ingName) => dispatch({
            type : actionTypes.REMOVE_INGREDIENT,
            ingredientName: ingName
        })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
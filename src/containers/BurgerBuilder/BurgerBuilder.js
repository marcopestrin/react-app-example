import React, {Component}            from 'react';
import {connect}                     from 'react-redux';
import  * as actions                 from '../../store/actions/index';
import Aux                           from '../../hoc/Aux/Aux';
import withErrorHandler              from '../../hoc/withErrorHandler/withErrorHandler';
import axios                         from '../../axios-orders';
import Burger                        from '../../components/Burger/Burger';
import BuildControls                 from '../../components/Burger/BuildControls/BuildControls'
import OrderSummary                  from '../../components/Burger/OrderSumary/OrderSummary';
import Spinner                       from '../../components/UI/Spinner/Spinner';
import Modal                         from '../../components/UI/Modal/Modal';

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
    componentDidMount() {
        this.props.onInitIngredients();
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
        if(this.props.isAuthenticated){ //posso acquistare solo da loggato
            this.setState({purchasing:true})
        }else{
            this.props.onSetAuthRedirectPath('checkout')
            this.props.history.push('/auth'); //redirect
        }
    }

    purchaseCancelHandle = () => { //rimuovi modal
        this.setState({purchasing:false})
    }

    purchaseContinueHandle = () => { //vai a checkout
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    };

    render() {
        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
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
                            isAuth={this.props.isAuthenticated}
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
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice,
        error:state.burgerBuilder.error,
        isAuthenticated:state.auth.token !== null
    };
}
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) =>  dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
import React, {Component}   from 'react';
import Aux                  from '../../hoc/Aux/Aux';
import Burger               from '../../components/Burger/Burger';
import BuildControls        from '../../components/Burger/BuildControls/BuildControls'
import Modal                from '../../components/UI/Modal/Modal';
import OrderSummary         from '../../components/Burger/OrderSumary/OrderSummary';

const INGREDIENTS_PRICE = { //prezzo di ogni singolo ingrediente
    salad:0.4,
    cheese:0.5,
    meat:1.3,
    bacon:0.6
};

class BurgerBuilder extends Component {
    state = {
        ingredients : { //configurazione base del panino
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 1
        },
        purchasing: false,
        purchaseable: false, //inizialmente non è acquistabile
        totalPrice: 5 //questo è il prezzo di partenza
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey =>{
                return ingredients[igKey]
            })
            .reduce((sum,el)=>{
                return sum + el
            })
        this.setState({
            purchaseable: sum > 0
        });
    }

    addIngredientHandler = (type) => {
        const updatedIngredients = {
            ...this.state.ingredients
        };
        const oldCount = this.state.ingredients[type];
        const updatedCounted = oldCount + 1;
        updatedIngredients[type] = updatedCounted;
        const priceAddition = INGREDIENTS_PRICE[type]
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const updatedIngredients = {
            ...this.state.ingredients
        };
        const oldCount = this.state.ingredients[type];
        if(oldCount<=0){
            return
        };
        const updatedCounted = oldCount - 1;
        updatedIngredients[type] = updatedCounted;
        const priceDedution = INGREDIENTS_PRICE[type]
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDedution;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandle = () => { //modal visibile
        this.setState({purchasing:true})
    }

    purchaseCancelHandle = () => { //rimuovi modal
        this.setState({purchasing:false})
    }

    purchaseContinueHandle = () => {
        
    }

    purchaseCancelHandle = () => {
        
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandle}>
                    <OrderSummary 
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        purchaseCancelled={this.purchaseCancelHandle}
                        purchaseContined={this.purchaseContinueHandle} />
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ordered={this.purchaseHandle}
                    disabled={disabledInfo} 
                    price ={this.state.totalPrice}
                    purchaseable={this.state.purchaseable}
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler} />
            </Aux>
        );
    }
}

export default BurgerBuilder;
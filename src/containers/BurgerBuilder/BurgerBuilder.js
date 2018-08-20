import React, {Component}   from 'react';
import Aux                  from '../../hoc/Aux';
import Burger               from '../../components/Burger/Burger';
import BuildControls        from '../../components/Burger/BuildControls/BuildControls'

const INGREDIENTS_PRICE = {
    salad: 0.4,
    cheese: 0.5,
    meat:1.3,
    bacon: 0.6
};

class BurgerBuilder extends Component {
    state = {
        ingredients : {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 1
        },
        purchaseable: false,
        totalPrice: 5
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
            ingredients: updatedCounted
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
            ingredients: updatedCounted
        })
        this.updatePurchaseState(updatedIngredients);
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
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    disabled={disabledInfo} 
                    price ={this.state.totalPrice}
                    purchaseable={this.state.purchaseable}
                    ingredientAdd={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler} />
            </Aux>
        );
    }
}

export default BurgerBuilder;
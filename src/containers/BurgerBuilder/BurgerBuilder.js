import React, {Component}   from 'react';
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
        ingredients:null,
        totalPrice:6, //questo è il prezzo di partenza
        loading:false,
        purchasing:false,
        purchaseable:false, //inizialmente non è acquistabile
        error:false
    }

    componentDidMount () {
        axios.get("https://react-my-burger-1840c.firebaseio.com/ingredients.json")
            .then(response => {
                this.setState({ingredients:response.data});
            })
            .catch(error => {
                this.setState({error:true});
            });
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

    purchaseContinueHandle = () => { //vai a checkout
           const queryParams = [];
           for(var i in this.state.ingredients){
                queryParams.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]))
           }
           queryParams.push('price=' + this.state.totalPrice);
           const queryString = queryParams.join('&'); 
           this.props.history.push({
               pathname:'/checkout',
               search:'?'+queryString
           });
    }

    render() {
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
        let orderSummary= null

        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        if(this.state.ingredients){ 
            //una volta che si sono caricati i dati degli ingredienti iniziali, viene rimosso lo spinner
            burger = (
                    <Aux>
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
            orderSummary = <OrderSummary 
                                ingredients={this.state.ingredients}
                                price={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios);
import * as actionType from "../actions/actionTypes";
import {updateObject} from '../utility'; 

const initialState = {
     ingredients:null,
     totalPrice:4,
     error:false,
     building:false
};
const INGREDIENTS_PRICE = { //prezzo di ogni singolo ingrediente
    salad:0.4,
    cheese:0.5,
    meat:1.3,
    bacon:0.6
};

const reducer  = (state = initialState, action) => {
    switch(action.type) {

        case actionType.ADD_INGREDIENT:
            const updatedIngredient = {
                [action.ingredientName]: state.ingredients[action.ingredientName]+1
            } //nuovo stato
            const updatedIngredients = updateObject(state.ingredients, updatedIngredient); //merge dei due stati d'ingredienti
            const updatedState = {
                building:true,
                ingredients: updatedIngredients,
                totalPrice: state.totalPrice + INGREDIENTS_PRICE[action.ingredientName]
            };
            return updateObject(state,updatedState);

        case actionType.REMOVE_INGREDIENT:
            const updatedIng = {
                [action.ingredientName]: state.ingredients[action.ingredientName]-1
            } //nuovo stato
            const updatedIngs = updateObject(state.ingredients, updatedIng); //merge dei due stati d'ingredienti
            const updatedSt = {
                ingredients: updatedIngs,
                totalPrice: state.totalPrice + INGREDIENTS_PRICE[action.ingredientName]
            };
            return updateObject(state,updatedSt);

        case actionType.SET_INGREDIENTS:
            return updateObject(state, {
                ingredients:{
                    salad:action.ingredients.salad,
                    cheese:action.ingredients.cheese,
                    bacon:action.ingredients.bacon,
                    meat:action.ingredients.meat,
                }, 
                totalPrice:4,
                error:false,
                building:false
            });

        case actionType.FETCH_INGREDIENTS_FAILED:
            return updateObject(state, {error:true})

        default:
            return state

    }
};

export default reducer;
import React            from 'react';
import classes          from './Burger.css';
import BurgerIngredient from './Burgeringredient/Burgeringredient';

const burger = (props) => {
    let newIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return  [...Array(props.ingredients[igKey])].map((_,i) => {
                <BurgerIngredient key={igKey+i} type={igKey} />
            });
        })
        .reduce((arr, el) =>{
            return arr.concat(el)
        },[] )

    console.log(newIngredients);

    if(newIngredients.length === 0){
        newIngredients = <p>Inizia ad aggiungere gli ingredienti</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
                {newIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burger;
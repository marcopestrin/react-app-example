import React            from 'react';
import classes          from './Burger.css';
import BurgerIngredient from './Burgeringredient/Burgeringredient';

const burger = (props) => {
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"></BurgerIngredient>
            <BurgerIngredient type="bread-cheese"></BurgerIngredient>
            <BurgerIngredient type="bread-meat"></BurgerIngredient>
            <BurgerIngredient type="bread-bacon"></BurgerIngredient>
            <BurgerIngredient type="bread-salad"></BurgerIngredient>
            <BurgerIngredient type="bread-bottom"></BurgerIngredient>
        </div>
    );
};

export default burger;
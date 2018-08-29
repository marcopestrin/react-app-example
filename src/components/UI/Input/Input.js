import React        from 'react';
import classes      from './Input.css';

const Input = (props) => {
    var element = null;
    var listClasses = [classes.Input];
    if(props.invalid && props.shouldValidate && props.touched){
        listClasses.push(classes.Invalid);
    }
    listClasses = listClasses.join(' ');
    switch (props.elementType) {
        case('input'):
            element = <input className={listClasses} {...props.value} onChange={props.changed} />;
            break;
        case('select'):
            element = (
                <select className={listClasses} onChange={props.changed} value={props.value}>
                    {props.elementConfig.options.map(option=>(
                        <option value={option.value} key={option.value} >
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            );
            break;
        default:
            element = <input className={listClasses} {...props.value} onChange={props.changed}/>;
        break
    }

    return( 
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {element}
        </div>
    );
};

export default Input;
import React, {Component}    from 'react';
import {connect}             from 'react-redux';
import {Redirect}            from 'react-router-dom';
import classes               from './Auth.css';
import Input                 from '../../components/UI/Input/Input';
import Button                from '../../components/UI/Button/Button';
import Spinner               from '../../components/UI/Spinner/Spinner';
import * as actions          from '../../store/actions/index';

class Auth extends Component {
    state = { //lo stato viene gestito senza redux perchè locale
        controls : {
            email: {
                element:'input',
                config: {
                    type:'email',
                    placeholder:'Your email adress'
                },
                value:'',
                validation: {
                    required:true,
                    isEmail:true
                },
                valid:false,
                touched:false
            },
            password: {
                element:'input',
                config: {
                    type:'password',
                    placeholder:'password'
                },
                value:'',
                validation: {
                    required:true,
                    minLength:6
                },
                valid:false,
                touched:false
            }
        },
        isSignUp:true
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

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value:event.target.value,
                touched:true,
                valid:this.validation(event.target.value, this.state.controls[controlName].validation)
            }
        };
        this.setState({
            controls:updatedControls
        });
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value,this.state.isSignUp);
    }

    switchAuthModeHandler = () => {
        console.log(this.state);
        this.setState(prevState => {
            return {isSignUp:!prevState.isSignUp}
        });
    }

    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }
 
    render(){
        const formElementsArray = [];
        for(var key in this.state.controls) {
            formElementsArray.push({    
                id:key, //IDENTIFICATIVO
                configuration:this.state.controls[key]
            })
        };
        var form = formElementsArray.map(formElement => (
            <Input
                key ={formElement.id} //IDENTIFICATIVO
                changed = {(event) => this.inputChangedHandler(event,formElement.id)}
                invalid = {!formElement.configuration.valid} //LA VALIDAZIONE E' ANDATA A BUON FINE??
                shouldValidate ={formElement.configuration.validation} //IL CAMPO E' OBBLIGATORIO?
                touched = {formElement.configuration.touched}
                elementConfig = {formElement.configuration.config}
                value = {formElement.configuration.config}
                elementType = {formElement.configuration.element} />
        ));
        if(this.props.loading) {
            form = <Spinner />
        };
        var errorMessage = null;
        if(this.props.error){
            errorMessage = (
                <p>{this.props.error.errorMessage}</p>
            );
        };
        var authRedirect = null;
        if(this.props.isAuthenticated){
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }
        return(
            <div className={classes.Auth}>
                <p>{this.state.isSignUp ? 'LOGIN' : 'REGISTRAZIONE'}</p>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button 
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">
                    SWITCH TO {this.state.isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading:state.auth.loading,
        error:state.auth.error,
        isAuthenticated:state.auth.token !== null,
        buildingBurger:state.burgerBuilder.building,
        authRedirectPath:state.auth.authRedirectPath
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email,password,isSignUp) => dispatch(actions.auth(email,password,isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(Auth);
import React, {Component}   from 'react';
import {connect}            from 'react-redux';
import Aux                  from '../Aux/Aux';
import classes              from './Layout.css';
import SideDrawer           from '../../components/Navigation/SideDrawer/SideDrawer';
import Toolbar              from '../../components/Navigation/Toolbar/Toolbar';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }
    sideDrawerclosedHandler = () => {
        this.setState({showSideDrawer:false});
    }
    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    }
    render() {
        return(
            <Aux>
                <Toolbar 
                    isAuth={this.props.isAuthenticated}
                    drawerToggleClicked={this.sideDrawerToggleHandler }/>
                <SideDrawer 
                    isAuth={this.props.isAuthenticated}
                    closed={this.sideDrawerclosedHandler} 
                    open={this.state.showSideDrawer} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>    
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated:state.auth.token != null
    }
}

export default connect(mapStateToProps)(Layout);
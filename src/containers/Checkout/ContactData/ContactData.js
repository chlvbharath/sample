import React, { Component } from 'react'
import {connect} from 'react-redux'
import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import classes from './ContactData.module.css'
import Input from '../../../components/UI/Input/Input'
import axios from '../../../axios-orders'
class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType:'input',
                elementConfig: {
                    type: 'text',
                    placeholder : 'your name'
                },
                value: '',
                validation: {
                    required : true,
                    minlength: 5
                },
                valid : false,
                touched: false
            },
            street: {
                elementType:'input',
                elementConfig: {
                    type: 'text',
                    placeholder : 'street'
                },
                value: '',
                validation: {
                    required : true
                },
                valid : false,
                touched: false
            },
            zip: {
                elementType:'input',
                elementConfig: {
                    type: 'text',
                    placeholder : 'zip'
                },
                value: '',
                validation: {
                    required : true,
                    minLength : 5,
                    maxLength : 5
                },
                valid : false,
                touched: false
            },
            country: {
                elementType:'input',
                elementConfig: {
                    type: 'text',
                    placeholder : 'country'
                },
                value: '',
                validation: {
                    required : true
                },
                valid : false,
                touched: false
            },
            email: {
                elementType:'input',
                elementConfig: {
                    type: 'text',
                    placeholder : 'email'
                },
                value: '',
                validation: {
                    required : true
                },
                valid : false,
                touched: false
            },
            deliveryMethod: {
                elementType:'select',
                elementConfig: {
                    options: [
                        {value :'fastest', displayValue: 'Fastest'},
                        {value :'normal', displayValue: 'Normal'}]
                },
                value: 'normal',
                validation: {},
                valid: true
            }
        },
        formIsValid : false,
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        // console.log(this.props.ingredients);
        this.setState({ loading: true })

        const formData = {};
        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        axios.post('/orders.json', order)
            .then(response => {
                console.log(response);
                this.setState({ loading: false})
                this.props.history.push('/');
            })
            .catch(error => {
                console.log(error);
                this.setState({ loading: false })
            }
            )
    }

    checkValidity(value, rules){
        let isValid = true;
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    inputchangedHandler = (event, inputIdentifier) => {
        console.log(event.target.value, inputIdentifier);
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {...updatedOrderForm[inputIdentifier]};
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
        }
        console.log(formIsValid);
        this.setState({orderForm : updatedOrderForm, formIsValid: formIsValid})
    }

    render() {
        const formElementsArray = [];
        for( let key in this.state.orderForm){
            formElementsArray.push({
                id : key,
                config: this.state.orderForm[key]
            });
        }
        debugger;

        let form = (
            <form onSubmit = {this.orderHandler}>
                {formElementsArray.map( formElement => (
                    <Input 
                        key={formElement.id}
                        elementType = {formElement.config.elementType}
                        elementConfig = {formElement.config.elementConfig} 
                        value = {formElement.value}
                        invalid = {!formElement.config.valid}
                        shouldValidate = {formElement.config.validation}
                        touched = {formElement.config.touched}
                        changed = { (event) => this.inputchangedHandler(event, formElement.id)} />
                ))}
                <Button
                    disabled={!this.state.formIsValid}
                    btnType='Success'>ORDER
                </Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}
export default connect(mapStateToProps)(ContactData);
import React, {Component} from 'react';
import {PRODUCTS, FilterableProductTable} from './components/FilterProductTable'
import {TodoList, ListOfTenThings} from "./components/JSXTest";
// import FormSelect from "./components/FormSelect";
import Navigation from "./components/TestNaigation";

class App extends Component {
    render() {
        return (
            <div className="App">
                {/*<FilterableProductTable products={PRODUCTS}/>*/}
                {/*<TodoList/>*/}
                {/*<ListOfTenThings/>*/}
                {/*<FormSelect/>*/}
                <Navigation/>
            </div>
        );
    }
}

export default App;

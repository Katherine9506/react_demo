import React from 'react';

function Item(props) {
    return <li>Hello {props.message}</li>;
}

export function TodoList() {
    const todos = ['finish doc', 'submit pr', 'nag dan to review'];
    return (
        <ul>
            {todos.map(message => <Item key={message} message={message}/>)}
        </ul>
    );
}

function Repeat(props) {
    let items = [];
    for (let i = 0; i < props.numTimes; i++) {
        items.push(props.children(i));
    }
    return <div>{items}</div>;
}

export function ListOfTenThings() {
    return (
        <Repeat numTimes={10}>
            {(index) => <div key={index}>This is item {index} in the list {String(undefined)}</div>}
        </Repeat>
    );
}
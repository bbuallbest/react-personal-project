import React, { Component } from 'react';

import Checkbox from 'theme/assets/Checkbox';
import Edit from 'theme/assets/Edit';
import Star from 'theme/assets/Star';
import Remove from 'theme/assets/Remove';

import Styles from './styles.m.css';

export default class Task extends Component {
    render () {
        const {
            completed,
            message,
        } = this.props;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <div className = { Styles.complete }>
                        <Checkbox checked = { completed } />
                    </div>
                    <input disabled type = 'text' value = { message } />
                </div>
                <div className = { Styles.actions }>
                    <div className = { Styles.setPriority }>
                        <Star />
                    </div>
                    <div className = { Styles.edit }>
                        <Edit />
                    </div>
                    <div>
                        <Remove />
                    </div>
                </div>
            </li>
        );
    }
}
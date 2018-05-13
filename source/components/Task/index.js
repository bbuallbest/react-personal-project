import React, { Component } from 'react';

import Checkbox from 'theme/assets/Checkbox';
import Edit from 'theme/assets/Edit';
import Star from 'theme/assets/Star';
import Remove from 'theme/assets/Remove';

import Styles from './styles.m.css';

export default class Task extends Component {
    constructor () {
        super();

        this._completeHandler = this._completeHandler.bind(this);
        this._favoriteHandler = this._favoriteHandler.bind(this);
        this._removeHandler = this._removeHandler.bind(this);
        this._editHandler = this._editHandler.bind(this);
    }

    state = {
        message:    '',
        inEditMode: false,
    }

    _completeHandler (e) {
        e.preventDefault();

        const {
            id,
            message,
            completed,
            favorite,
            updateTask,
        } = this.props;

        updateTask({
            id,
            message,
            completed: !completed,
            favorite,
        });
    }

    _favoriteHandler (e) {
        e.preventDefault();

        const { inEditMode } = this.state;
        if (inEditMode) {
            return;
        }

        const {
            id,
            message,
            completed,
            favorite,
            updateTask,
        } = this.props;

        updateTask({
            id,
            message,
            completed,
            favorite: !favorite,
        });
    }

    _editHandler (e) {
        e.preventDefault();

        this.setState((prevState) => ({
            inEditMode: !prevState.inEditMode,
        }));
    }

    _removeHandler (e) {
        e.preventDefault();

        const { inEditMode } = this.state;
        if (inEditMode) {
            return;
        }

        const { id, removeTask } = this.props;
        removeTask(id);
    }

    _messageChangeHandler (e) {
        e.preventDefault();


    }

    render () {
        const { inEditMode } = this.state;
        const {
            completed,
            favorite,
            message,
        } = this.props;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <div className = { Styles.complete }>
                        <Checkbox
                            checked = { completed }
                            disabled = { inEditMode }
                            onClick = { this._completeHandler }
                        />
                    </div>
                    <input
                        disabled = { !inEditMode }
                        type = 'text'
                        value = { message }
                        onChange = { this._messageChangeHandler }
                    />
                </div>
                <div className = { Styles.actions }>
                    <div className = { Styles.action }>
                        <Star
                            checked = { favorite }
                            disabled = { inEditMode }
                            onClick = { this._favoriteHandler }
                        />
                    </div>
                    <div className = { Styles.edit }>
                        <Edit
                            checked = { inEditMode }
                            onClick = { this._editHandler }
                        />
                    </div>
                    <div className = { Styles.action }>
                        <Remove
                            disabled = { inEditMode }
                            onClick = { this._removeHandler }
                        />
                    </div>
                </div>
            </li>
        );
    }
}

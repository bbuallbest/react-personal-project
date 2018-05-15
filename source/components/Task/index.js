import React, { Component } from 'react';

import Checkbox from 'theme/assets/Checkbox';
import Edit from 'theme/assets/Edit';
import Star from 'theme/assets/Star';
import Remove from 'theme/assets/Remove';

import Styles from './styles.m.css';

import { ENTER, ESCAPE } from 'instruments/keyCodes';

export default class Task extends Component {
    constructor (props) {
        super(props);

        this.state = {
            message:    this.props.message,
            inEditMode: false,
        };

        this._completeHandler = this._completeHandler.bind(this);
        this._favoriteHandler = this._favoriteHandler.bind(this);
        this._removeHandler = this._removeHandler.bind(this);
        this._editHandler = this._editHandler.bind(this);
        this._messageChangeHandler = this._messageChangeHandler.bind(this);
        this._finishChangesHandler = this._finishChangesHandler.bind(this);
        this._applyChanges = this._applyChanges.bind(this);
        this._skipChanges = this._skipChanges.bind(this);
    }

    _completeHandler (e) {
        e.preventDefault();

        const {
            message,
            inEditMode,
        } = this.state;

        if (inEditMode) {
            return;
        }

        const {
            id,
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

        const {
            message,
            inEditMode,
        } = this.state;

        if (inEditMode) {
            return;
        }

        const {
            id,
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

        this.setState({
            message: e.target.value,
        });
    }

    _finishChangesHandler (e) {
        const keyCode = e.charCode;

        if (keyCode === 13) {
            this._applyChanges();
        } else if (keyCode === 27) {
            this._skipChanges();
        }
    }

    _skipChanges () {
        const {
            message,
        } = this.props;

        this.setState(({ inEditMode }) => ({
            message,
            inEditMode: !inEditMode,
        }));
    }

    _applyChanges () {
        const {
            message,
        } = this.state;

        const {
            id,
            completed,
            favorite,
            updateTask,
        } = this.props;

        updateTask({
            id,
            message,
            completed,
            favorite,
        });

        this.setState(({ inEditMode }) => ({
            inEditMode: !inEditMode,
        }));
    }

    render () {
        const {
            message,
            inEditMode,
        } = this.state;
        const {
            completed,
            favorite,
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
                        maxLength = '50'
                        type = 'text'
                        value = { message }
                        onChange = { this._messageChangeHandler }
                        onKeyPress = { this._finishChangesHandler }
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

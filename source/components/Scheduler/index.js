import React, { Component } from 'react';

import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';
import { withApi } from "../HoK/withApi";

import Styles from './styles.m.css';

@withApi
export default class Scheduler extends Component {
    constructor () {
        super();

        this._handleSubmit = this._handleSubmit.bind(this);
        this._enterHandler = this._enterHandler.bind(this);
        this._createTaskHandler = this._createTaskHandler.bind(this);
        this._searchChangeHandler = this._searchChangeHandler.bind(this);
        this._createTaskOnChangeHandler = this._createTaskOnChangeHandler.bind(this);
    }

    state = {
        createTaskMessage: '',
    }

    _handleSubmit (e) {
        e.preventDefault();

        this._createTaskHandler(e.target.taskMessage.value);
    }

    _createTaskHandler (message) {
        if (!message) {
            return;
        }

        const { createTask } = this.props;
        createTask(message);
    }

    _accumulateTasks () {
        const {
            removeTask,
            tasks,
            updateTask,
        } = this.props;

        return tasks
            .filter((task) => {
                const display = task.display;

                if (typeof display === 'undefined') {
                    return true;
                }

                return display;
            })
            .map(({ id, completed, favorite, message }) => (
                <Task
                    completed = { completed }
                    favorite = { favorite }
                    id = { id }
                    key = { id }
                    message = { message }
                    removeTask = { removeTask }
                    updateTask = { updateTask }
                />
            ));
    }

    _searchChangeHandler (e) {
        e.preventDefault();

        const { filterTasks } = this.props;
        const searchWord = e.target.value;

        filterTasks(searchWord);
    }

    _enterHandler (e) {
        if (e.charCode !== 13) {
            return;
        }

        e.preventDefault();

        this._createTaskHandler(this.state.createTaskMessage);
        this.setState({
            createTaskMessage: '',
        });
    }

    _createTaskOnChangeHandler (e) {
        e.preventDefault();

        this.setState({
            createTaskMessage: e.target.value,
        });
    }

    render () {
        const { searchWord } = this.props;
        const { createTaskMessage } = this.state;

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Task Scheduler</h1>
                        <input
                            placeholder = 'Search'
                            type = 'text'
                            value = { searchWord }
                            onChange = { this._searchChangeHandler }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._handleSubmit }>
                            <input
                                maxLength = '50'
                                name = 'taskMessage'
                                placeholder = 'Describe new task'
                                type = 'text'
                                value = { createTaskMessage }
                                onChange = { this._createTaskOnChangeHandler }
                                onKeyPress = { this._enterHandler }
                            />
                            <button>Create Task</button>
                        </form>
                        <ul>
                            {this._accumulateTasks()}
                        </ul>
                    </section>
                    <footer>
                        <div>
                            <Checkbox />
                        </div>
                        <span>Complete all tasks</span>
                    </footer>
                </main>
            </section>
        );
    }
}

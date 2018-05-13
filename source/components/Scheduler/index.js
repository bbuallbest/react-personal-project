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
    }

    _handleSubmit (e) {
        e.preventDefault();

        const message = e.target.taskMessage.value;

        if (!message) {
            return;
        }

        const { createTask } = this.props;
        createTask(message);
    }

    accumulateTasks () {
        const {
            removeTask,
            tasks,
            updateTask,
        } = this.props;

        return tasks.map(({ id, completed, favorite, message }) => (
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

    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Task Scheduler</h1>
                        <input placeholder = 'Search' type = 'text' />
                    </header>
                    <section>
                        <form onSubmit = { this._handleSubmit }>
                            <input name = 'taskMessage' placeholder = 'Describe new task' type = 'text' />
                            <button>Create Task</button>
                        </form>
                        <ul>
                            {this.accumulateTasks()}
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

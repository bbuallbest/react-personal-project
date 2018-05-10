import React, { Component } from 'react';

import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';

import Styles from './styles.m.css';
import Tasks from './tasks';

export default class Scheduler extends Component {
    state = {
        tasks: [],
    };

    accumulateTasks (tasks) {
        return tasks.map(({ id, completed, message }) => (
            <Task
                completed = { completed }
                key = { id }
                message = { message }
            />
        ));
    }

    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Task Scheduler</h1>
                        <input type = 'text' />
                    </header>
                    <section>
                        <form>
                            <input type = 'text' />
                            <button>Create</button>
                        </form>
                        <ul>
                            {this.accumulateTasks(Tasks.tasks)}
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

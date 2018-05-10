import React, { Component } from 'react';

import Styles from './styles.m.css';

export default class Scheduler extends Component {
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
                            <li>First Task</li>
                            <li>Second Task</li>
                        </ul>
                    </section>
                    <footer>
                        <div></div>
                        <span>Complete all tasks</span>
                    </footer>
                </main>
            </section>
        );
    }
}

import React, { Component } from 'react';

import { url, token } from 'config/api';

const withApi = (Enhanced) =>
    class WithApi extends Component {
        constructor () {
            super();

            this._fetchTasks = this._fetchTasks.bind(this);
            this.createTask = this._createTask.bind(this);
            this.removeTask = this._removeTask.bind(this);
            this.updateTask = this._updateTask.bind(this);
        }

        state = {
            tasks: [],
        }

        componentDidMount () {
            this._fetchTasks();
        }

        _noErrors (func) {
            try {
                func();
            } catch ({ message }) {
                console.error(message);
            }
        }

        async _fetchTasks () {
            try {
                const res = await fetch(url, {
                    headers: {
                        Authorization: token,
                    },
                });

                if (res.status !== 200) {
                    throw new Error(`Can not get tasks from server. Response status ${res.status}`);
                }

                const payload = await res.json();

                this.setState({
                    tasks: [...payload.data],
                });
            } catch (e) {
                console.error(e.message);
            }
        }

        async _createTask (message) {
            try {
                const res = await fetch(url, {
                    method:  'POST',
                    headers: {
                        Authorization:  token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                });

                if (res.status !== 200) {
                    throw new Error(`Can not create task. Response status ${res.status}`);
                }

                const payload = await res.json();

                this.setState((prevState) => ({
                    tasks: [payload.data, ...prevState.tasks],
                }));
            } catch (e) {
                console.error(e.message);
            }
        }

        async _removeTask (id) {
            try {
                const res = await fetch(`${url}/${id}`, {
                    method:  'DELETE',
                    headers: {
                        Authorization: token,
                    },
                });

                if (res.status !== 204) {
                    throw new Error(`Can not delete task. Response status ${res.status}`);
                }

                this.setState((prevState) => ({
                    tasks: prevState.tasks.filter((task) => task.id !== id),
                }));
            } catch (e) {
                console.error(e.message);
            }
        }

        async _updateTask (updatedTask) {
            try {
                const res = await fetch(url, {
                    method:  'PUT',
                    headers: {
                        Authorization:  token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([updatedTask]),
                });

                if (res.status !== 200) {
                    throw new Error(`Can not update task. Response status ${res.status}`);
                }

                this.setState((prevState) => {
                    const toBeUpdated = prevState.tasks.find((task) => task.id === updatedTask.id);

                    if (toBeUpdated) {
                        toBeUpdated.message = updatedTask.message;
                        toBeUpdated.completed = updatedTask.completed;
                        toBeUpdated.favorite = updatedTask.favorite;
                    }

                    return {
                        tasks: [...prevState.tasks],
                    };
                });
            } catch (e) {
                console.error(e.message);
            }
        }

        render () {
            return (
                <Enhanced
                    createTask = { this.createTask }
                    removeTask = { this.removeTask }
                    tasks = { this.state.tasks }
                    updateTask = { this.updateTask }
                />
            );
        }
    }
export {
    withApi
};
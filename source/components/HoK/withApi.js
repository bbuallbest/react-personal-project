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
            this.filterTasks = this._filterTasks.bind(this);
            this.selectAllTasks = this._selectAllTasks.bind(this);
        }

        state = {
            allSelected: false,
            tasks:       [],
            searchWord:  '',
        }

        componentDidMount () {
            this._fetchTasks();
        }

        _selectAllTasks () {
            this.setState(({ tasks, allSelected }) => {
                if (allSelected) {
                    return {};
                }

                tasks.forEach((task) => task.completed = true);

                return {
                    tasks:       this._reorderTasks(tasks),
                    allSelected: true,
                };
            });
        }

        _isAllSelected (prevCompleted, nextCompleted) {
            if (prevCompleted === nextCompleted) {
                return prevCompleted;
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
                    tasks: this._reorderTasks([...payload.data]),
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

                this.setState((prevState) => {
                    const newTask = this._resolveTaskSearchState(payload.data, prevState.searchWord);

                    return {
                        tasks: this._reorderTasks([newTask, ...prevState.tasks]),
                    };
                });
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
                    const searchWord = prevState.searchWord;
                    const allSelected = this._isAllSelected(toBeUpdated.completed, updatedTask.completed);

                    if (toBeUpdated) {
                        toBeUpdated.message = updatedTask.message;
                        toBeUpdated.completed = updatedTask.completed;
                        toBeUpdated.favorite = updatedTask.favorite;
                    }

                    this._resolveTaskSearchState(toBeUpdated, searchWord);

                    return {
                        tasks: this._reorderTasks([...prevState.tasks]),
                        allSelected,
                    };
                });
            } catch (e) {
                console.error(e.message);
            }
        }

        _resolveTaskSearchState (task, searchWord) {
            let display = true;

            if (task.message.indexOf(searchWord) === -1) {
                display = false;
            }

            if (task.hasOwnProperty('display')) {
                task.display = display;

                return task;
            }

            return Object.assign(task, { display });
        }

        _filterTasks (searchWord) {
            this.setState(({ tasks }) => {
                tasks.map((task) => this._resolveTaskSearchState(task, searchWord));

                return {
                    tasks: [...tasks],
                    searchWord,
                };
            });
        }

        _reorderTasks (tasks) {
            const completedUnfavorite = this._getTasks(tasks, true, false);
            const completedFavorite = this._getTasks(tasks, true, true);
            const uncompletedUnfavorite = this._getTasks(tasks, false, false);
            const uncompletedFavorite = this._getTasks(tasks, false, true);
            const reordered = [...uncompletedFavorite, ...uncompletedUnfavorite, ...completedFavorite, ...completedUnfavorite];

            if (tasks.length !== reordered.length) {
                console.log(`Ordered tasks list has wrong length. Expected ${tasks.length} but has ${reordered.length}`);

                return tasks;
            }

            return reordered;
        }

        _getTasks (tasks, completed, favorite) {
            return tasks.filter((task) => task.completed === completed && task.favorite === favorite);
        }

        render () {
            const {
                allSelected,
                tasks,
                searchWord,
            } = this.state;

            return (
                <Enhanced
                    allSelected = { allSelected }
                    createTask = { this.createTask }
                    filterTasks = { this.filterTasks }
                    removeTask = { this.removeTask }
                    searchWord = { searchWord }
                    selectAllTasks = { this.selectAllTasks }
                    tasks = { tasks }
                    updateTask = { this.updateTask }
                />
            );
        }
    };

export {
    withApi
};

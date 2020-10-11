const { Todo } = require('./mongo');

const listTodos = async (userId, active = true) => {
    try{
        return  await Todo.find({ userId, active });
    }catch (e) {
        logger.error('failed to fetch todo list -', e);
        return Promise.resolve(new CustomError("failed to fetch todo list", 500));
    }
}

const deleteTodo = async (id) => {
    try{
        await Todo.findOneAndRemove({ _id: id });
    }catch (e) {
        logger.error('failed to delete task -', e);
        return Promise.resolve(new CustomError("failed to delete task", 500));
    }
}

const createTask = async (task, description, userId) => {
    try{
        const data = new Todo({ task, description, userId });
        data.save();
        return data._doc;
    }catch (e) {
        logger.error('failed to create task -', e);
        return Promise.resolve(new CustomError("failed to create task", 500));
    }
}

const markComplete = async (id) => {
    try{
        return await Todo.findOneAndUpdate({ _id: id }, { active: false }, { new: true });
    }catch (e) {
        logger.error('failed to update task -', e);
        return Promise.resolve(new CustomError("failed to update the task", 500));
    }
}

module.exports = {
    listTodos,
    deleteTodo,
    createTask,
    markComplete
};

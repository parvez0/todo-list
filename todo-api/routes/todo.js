const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { deleteTodo, listTodos, createTask, markComplete } = require('../models/todo');

router.get('/list', auth, async (req, res) => {
    try{
        const active = req.query.active;
        const todos = await listTodos(req.userId, active)
        return res.publish(true, 'found task', { todos });
    }catch (e) {
        return res.publish(false, "failed to perform the specified task", { message: e.message }, e.statusCode ? e.statusCode() : 500);
    }
});

router.post('/create', auth, async (req, res) => {
    try{
        if(!req.body.task){
            return res.publish(false, 'Bad request', { message: 'required field task not provided' }, 400);
        }
        const task = await createTask(req.body.task, req.body.description, req.userId);
        return res.publish(true, 'task created', task)
    }catch (e) {
        return res.publish(false, "failed to create task", { message: e.message }, e.statusCode ? e.statusCode() : 500);
    }
});

router.put('/:id', auth, async (req, res) => {
    try{
        if(!req.params.id){
            return res.publish(false, 'Bad request', { message: 'required field id not provided' }, 400);
        }
        const data = await markComplete(req.params.id);
        return res.publish(true, 'task updated', data);
    }catch (e) {
        return res.publish(false, "failed to perform the specified task", { message: e.message }, e.statusCode ? e.statusCode() : 500);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try{
        if(!req.params.id){
            return res.publish(false, 'Bad request', { message: 'required field id not provided' }, 400);
        }
        await deleteTodo(req.params.id);
        return res.publish(true, 'task deleted', { });
    }catch (e) {
        return res.publish(false, "failed to perform the specified task", { message: e.message }, e.statusCode ? e.statusCode() : 500);
    }
});

module.exports = router;

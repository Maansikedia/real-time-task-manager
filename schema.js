const { gql } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PubSub } = require('graphql-subscriptions');
const Task = require('./models/task');
const User = require('./models/user');

const pubsub = new PubSub();

const typeDefs = gql`
  type Task {
    _id: ID!
    title: String!
    description: String
    dueDate: String
    status: String!
    assignee: User
  }

  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type Query {
    users: [User!]!
    me: User
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      role: String!
    ): User

    login(email: String!, password: String!): String

    createTask(
      title: String!
      description: String
      dueDate: String
      assignee: ID
    ): Task!
    updateTask(
      id: ID!
      title: String
      description: String
      dueDate: String
      status: String
      assignee: ID
    ): Task
    deleteTask(id: ID!): Task
  }

  type Subscription {
    taskCreated: Task
    taskUpdated: Task
    taskDeleted: ID
  }
`;

const resolvers = {
  Query: {
    users: async () => await User.find(),
    me: async (args, req) => {
      if (!req.userId) {
        return null;
      }
      return await User.findById(req.userId);
    },

    tasks: async () => {
      try {
        const tasks = await Task.find().populate('assignee');
        return tasks;
      } catch (error) {
        throw new Error('Error fetching tasks');
      }
    },
    task: async (_, { id }) => {
      try {
        const task = await Task.findById(id).populate('assignee');
        return task;
      } catch (error) {
        throw new Error('Error fetching task');
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      const { username, email, password, role } = args; // Destructure arguments

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });
      await user.save();
      return user;
    },
    login: async (_, args) => {
      const { email, password } = args; // Destructure arguments

      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
      return token;
    },
    createTask: async (_, { title, description, dueDate, assignee }) => {
      // Convert assignee ID string to ObjectId
      const assigneeId = mongoose.Types.ObjectId(assignee);
      // create the task
      try {
        const newTask = await Task.create({
          title,
          description,
          dueDate,
          assigneeId,
        });
        pubsub.publish('TASK_CREATED', { taskCreated: newTask });
        return newTask;
      } catch (error) {
        console.log(error);
        throw new Error('Error creating task');
      }
    },
    updateTask: async (
      _,
      { id, title, description, dueDate, status, assignee }
    ) => {
      try {
        const updatedTask = await Task.findByIdAndUpdate(
          id,
          { title, description, dueDate, status, assignee },
          { new: true }
        ).populate('assignee');
        pubsub.publish('TASK_UPDATED', { taskUpdated: updatedTask });
        return updatedTask;
      } catch (error) {
        throw new Error('Error updating task');
      }
    },
    deleteTask: async (_, { id }) => {
      try {
        const deletedTask = await Task.findByIdAndDelete(id).populate(
          'assignee'
        );
        pubsub.publish('TASK_DELETED', { taskDeleted: id });
        return deletedTask;
      } catch (error) {
        throw new Error('Error deleting task');
      }
    },
  },
  Subscription: {
    taskCreated: {
      subscribe: () => pubsub.asyncIterator(['TASK_CREATED']),
    },
    taskUpdated: {
      subscribe: () => pubsub.asyncIterator(['TASK_UPDATED']),
    },
    taskDeleted: {
      subscribe: () => pubsub.asyncIterator(['TASK_DELETED']),
    },
  },
};

module.exports = { typeDefs, resolvers };

import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()
export const routes = [
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: async (request, response) => {
          try {
            const { title, description } = request.body;
            const task = {
              id: randomUUID(),
              title,
              description,
              completed_at: null,
              created_at: new Date(),
              updated_at: new Date()
            };
      
            await database.insert('tasks', task);
      
            response.writeHead(201);
            response.end();
          } catch (error) {
            console.error('Error handling POST request:', error);
            response.writeHead(500);
            response.end();
          }
        }
    },
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (request, response) => {
            const search = request.query
            const tasks = database.select('tasks', search.title || search.description ? {
                title: search.title,
                description: search.description
            } : null)

            return response.end(JSON.stringify(tasks))
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (request, response) => {
            const { id } = request.params
            const { title, description } = request.body
            database.update('tasks', id, { title, description, updated_at: new Date() })

            return response.writeHead(204).end()
        }
    },

    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (request, response) => {
            const { id } = request.params
            database.delete('tasks', id)
            return response.writeHead(204).end()
        }
    },

    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (request, response) => {
            const { id } = request.params
            database.complete('tasks', id)
            return response.writeHead(204).end()
        }
    },
    
]
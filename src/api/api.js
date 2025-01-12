import axios from "axios";

const API_BASE_URL = "http://localhost:8080/";

export const api = {
  authenticate,
  getClientByUserId,
  updateClient,
  getContactsByClientId,
  updateContact,
  deleteContactById,
  createContact,
  getTasksByClientId,
  deleteTaskById,
  createTask,
  updateTask,
  createClient,
  getContactByUserId,
  getClientById
}

function authenticate(username, password) {
  return instance.post('public/auth/authenticate', { username, password }, {
    headers: { 'Content-type': 'application/json' }
  })
}

function getClientByUserId(user) {
  const url = "/api/v_0/client/user/" + user.id;
  return instance.get(url, {headers: {'Authorization': basicAuth(user)}})
}

function getClientById(user, contact) {
  const url = "/api/v_0/client/" + contact.clientId;
  return instance.get(url, {headers: {'Authorization': basicAuth(user)}})
}

function createClient(client) {
  return instance.post('/public/api/v_0/client', client, {
    headers: { 'Content-type': 'application/json' }
  })
}

function updateClient(user, clientData) {
  const url = "/api/v_0/client";
  return instance.put(url, clientData, {headers: {'Authorization': basicAuth(user)}});
}

function getContactByUserId(user) {
  const url = "/api/v_0/contact/user/" + user.id;
  return instance.get(url, {headers: {'Authorization': basicAuth(user)}})
}

function updateContact(user, contactData) {
  const url = "/api/v_0/contact";
  return instance.put(url, contactData, {headers: {'Authorization': basicAuth(user)}});
}

function createContact(user, contact) {
  const url = "/api/v_0/contact";
  return instance.post(url, contact, {headers: {'Authorization': basicAuth(user)}});
}

function getContactsByClientId(user, clientId) {
  const url = "/api/v_0/contact/client/" + clientId;
  return instance.get(url, {headers: {'Authorization': basicAuth(user)}});
}

function deleteContactById(user, contactId) {
  const url = "/api/v_0/contact/" + contactId;
  return instance.delete(url, {headers: {'Authorization': basicAuth(user)}});
}

function getTasksByClientId(user, clientId) {
  const url = "/api/v_0/task/client/" + clientId;
  return instance.get(url, {headers: {'Authorization': basicAuth(user)}});
}

function deleteTaskById(user, taskId) {
  const url = "/api/v_0/task/" + taskId;
  return instance.delete(url, {headers: {'Authorization': basicAuth(user)}});
}

function createTask(user, task) {
  const url = "/api/v_0/task";
  return instance.post(url, task, {headers: {'Authorization': basicAuth(user)}});
}

function updateTask(user, taskData) {
  const url = "/api/v_0/task";
  return instance.put(url, taskData, {headers: {'Authorization': basicAuth(user)}});
}

const instance = axios.create({
      baseURL: API_BASE_URL
})

function basicAuth(user) {
  return `Bearer ${user.token}`
}
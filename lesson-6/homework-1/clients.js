const clients = [];

export const addClient = (id, name, room) => {
  const client = { id, name, room };

  clients.push(client);
  return { client };
};

export const getClient = (id) => {
  let client = clients.find((client) => client.id === id);
  return client;
};

export const deleteClient = (id) => {
  const index = clients.findIndex((client) => client.id === id);
  if (index !== -1) return clients.splice(index, 1)[0];
};

export const getClients = (room) =>
  clients.filter((client) => client.room === room);

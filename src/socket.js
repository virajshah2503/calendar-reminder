const url = 'ws://localhost:8080';
const Connection = new WebSocket(url);

Connection.onopen = () => {
  Connection.send('hey');
};

Connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
};

Connection.onmessage = (e) => {
  console.log(e.data);
};

export default Connection;
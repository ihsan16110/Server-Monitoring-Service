
const axios = require('axios');
const os = require('os-utils');

const SERVER_URL = 'http://central-server-ip:3000/api/metrics';
const SERVER_ID = 'your-server-id'; // Replace with the actual server ID

const collectData = () => {
  os.cpuUsage((cpuUsage) => {
    const data = {
      server_id: SERVER_ID,
      cpu: cpuUsage * 100, // percentage
      memory: (1 - os.freememPercentage()) * 100, // percentage
      disk: 0, // Implement disk usage collection
      network: 0, // Implement network usage collection
    };

    axios.post(SERVER_URL, data)
      .then(response => {
        console.log('Data sent:', response.data);
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  });
};

setInterval(collectData, 10000); // Send data every 10 seconds


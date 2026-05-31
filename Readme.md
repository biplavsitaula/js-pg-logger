### A logger service
    Here, a developer can maintain the log of api calls, methods and other services.
    When you initilize the logger, the process will create a table in the database to store the logs. The table will have the following columns:
    - id: the primary key of the log
    - other fields can be added as per the requirement of the developer.
    The logger service will have the following methods:
    - init: to initialize the logger and create the table in the database.
    - save: to save the log in the database.
    - getLogs: to retrieve the logs from the database.
    The logger service can be used in any part of the application to log the required information. The logs can be retrieved and analyzed to understand the behavior of the application and to debug any issues that may arise.

### Usage
    To use the logger service, you can follow the steps below:
    1. Import the logger service in your application.
    2. Initialize the logger service by calling the init method.
    3. Use the save method to log the required information in the database.
    4. Use the getLogs method to retrieve the logs from the database for analysis.

### Example
```javascript
const LoggerService = require('./loggerService');
const logger = new LoggerService();
// Initialize the logger service
logger.init(db_url,{
    //fields to be logged
        method: 'string',
        endpoint: 'string',
        status: 'number',
        responseTime: 'number'
});
// Log an API call
logger.save({
    method: 'GET',
    endpoint: '/api/users',
    status: 200,
    responseTime: 150
});
// Retrieve the logs
logger.getLogs();
```
### Conclusion
    The logger service is a useful tool for developers to maintain the log of api calls, methods and other services. It helps in understanding the behavior of the application and debugging any issues that may arise. By using the logger service, developers can easily track the performance of their application and make necessary improvements.

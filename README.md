# Heliverse

### This is the ReactJS, NodeJS and Mongodb project


#### To run it on local system donload the zip file or clone the repository and then

npm install in both folders frontend and backend



#### Then change the value of the following parameters in the backend -> index.js

mongoose.connect('replace with your mongoDB local connection link with database name Heliverse')
--- and ---
app.use(cors(
    {
        origin: ["http://localhost:3024"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
))

#### In frontend just change the link from https://heliverse-api.vercel.app to http://localhost:8096

Now run the command on different terminal for both the directories
##### npm start for the frontend and nodemon or npm start for the backend

Now you can perform the operations

### Deployed link for backend is https://heliverse-api.vercel.app/

### Deployed link for frontend is https://heliverse-1ugi.vercel.app/

##### Operations followed are GET /api/users , GET /api/users/:id , POST /api/users , PUT /api/users/:id , DELETE /api/users/:id and the APIs for creating the team is also implemented, filtration is implemented.

Some error is occuring while deploying the frontend CORS policy error whereas the backend on it's own and the frontend on it's own working fine. I prefer to install it on local system to see the result.

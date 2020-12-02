import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import '@babel/polyfill';
import userRoutes from './routes/userRoutes';


const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', userRoutes);


app.get('/', (req, res) => res.status(301).redirect('/api'));

app.get('/api', (req, res) =>
    res.status(200).send({
        message: 'Welcome to Express Api',
    }),
);

// Throw error when user enters wrong Endpoints
app.use((req, res) => res.status(404).send({
    error: 'Oops! Endpoint not found, Please Check that you are entering the right thing!',
}));

app.use((err, req, res, next) => {
    res.status(500).send({
        error: 'Invalid Request! Please Check that you are entering the right thing!',
    });
});

const port = process.env.PORT || 8000;

/* app.listen(port, () => {
    console.log(`Server is live on PORT: ${port}`);
});*/

const server = require('http').createServer(app)

export const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
server.listen(port)
//io.sockets.emit('hi','everyone')
let interval 
io.on("connection", socket => {
    console.log(socket.id);
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });
  });

  
  const getApiAndEmit = socket => {
    // Emitting a new message. Will be consumed by the client
    socket.emit("getUsers", 'Odpowiedz');
  };

export default server;
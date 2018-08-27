import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-1840c.firebaseio.com/'
})

export default instance;
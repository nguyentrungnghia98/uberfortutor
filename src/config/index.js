const prod = {
  url: {
    API_URL: 'https://backend-giasu.herokuapp.com/',
  }
}

const dev = {
  url: {
    API_URL: 'http://localhost:3001'
  }
};

export default  process.env.NODE_ENV === 'development' ? dev : prod;
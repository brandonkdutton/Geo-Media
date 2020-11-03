export async function postData(url = '', data = {}, customHeaders = {}) {

  const uri = `${process.env.REACT_APP_API_BASE_URI}${url}`;

  const response = await fetch(uri, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
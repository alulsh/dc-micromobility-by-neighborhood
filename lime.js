function getLimeBikes() {
  return new Promise((resolve) => {
    fetch("https://vercel-test-alulsh.vercel.app/api/proxy?service=lime")
      .then((response) => response.json())
      .then((jsonData) => {
        resolve(jsonData.data.bikes);
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
}

// eslint-disable-next-line import/prefer-default-export
export { getLimeBikes };

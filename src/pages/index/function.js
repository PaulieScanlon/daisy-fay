export const getServerData = async () => {
  const request = await fetch('https://dummyjson.com/products?limit=10');
  const data = await request.json();

  return data;
};

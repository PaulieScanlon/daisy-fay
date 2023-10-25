const Page = ({ data }) => {
  return (
    <main>
      <h1>Carts</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
};

export default Page;

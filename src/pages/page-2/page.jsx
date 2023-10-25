const Page = ({ data }) => {
  return (
    <main>
      <h1>Page 2</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
};

export default Page;

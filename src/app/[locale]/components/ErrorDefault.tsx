type Props = {
  message: string;
};
function ErrorDefault({ message }: Props) {
  return (
    <div>
      <h1>Error</h1>
      <p>{message}</p>
    </div>
  );
}

export default ErrorDefault;

interface Props {
  probabilities: number[];
}

function Probabilities({ probabilities }: Props) {
  return (
    <>
      <h1>Probabilites</h1>
      {probabilities.map((item) => (
        <li>{item}</li>
      ))}
    </>
  );
}

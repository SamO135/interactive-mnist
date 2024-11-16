import "../style.css";

interface Props {
  predicted_class: string;
  probabilities: number[];
}

function Probabilities({ predicted_class, probabilities }: Props) {
  return (
    <div id="probabilities">
      <h1>Predicted Class: {predicted_class}</h1>
      <h2>Probabilities:</h2>
      <ul>
        {probabilities.map((probability, index) => (
          <li key={index}>{probability}</li>
        ))}
      </ul>
    </div>
  );
}

export default Probabilities;

from pydantic import BaseModel


class ModelResponse(BaseModel):
    """Prediction response from the model."""
    predicted_class: int
    probabilities: list[float]

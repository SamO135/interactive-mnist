from network.neural_network import Network
from torch import Tensor
from torchvision import datasets
import torchvision.transforms as transforms
from torchvision.transforms import ToTensor
import torch.nn.functional as F
import torch
import random
from schema import *
import numpy as np
import fastapi
import io
from PIL import Image, ImageOps


class Services:

    def __init__(self):
        """Creates the model object and loads the pretrained weights."""
        self.model = Network()
        self.model.load_state_dict(
            torch.load('network/model_weights.pkl', weights_only=True))
        self.model.eval()

    def predict_number(self, image: Tensor) -> ModelResponse:
        """Passes an image through the model and returns a prediction.

        Args:
            image (Tensor): The image to pass through the model

        Returns:
            predicted class and probabilities for all classes"""
        output = self.model(image.unsqueeze(0))
        probabilities = F.softmax(output, dim=1).tolist()[0]
        predicted_class = np.argmax(probabilities)
        return ModelResponse(predicted_class=predicted_class, probabilities=probabilities)

    async def predict_user_number(self, file: fastapi.UploadFile):
        file = await file.read()

        # Convert fastapi.UploadFile type to PIL image
        image = Image.open(io.BytesIO(file)).convert("L")

        # Invert colours to match MNIST data set
        image = ImageOps.invert(image)

        # Define image properties
        transform = transforms.Compose([
            transforms.Resize((28, 28)),
            transforms.ToTensor(),
        ])

        # Convert PIL image data to a Tensor object with correct properties
        image_tensor = transform(image)

        return self.predict_number(image_tensor)

    def random_image(self) -> Tensor:
        """Gets a random image from MNIST test set for testing/debugging purposes."""
        test_data = datasets.MNIST(root='network/data',
                                   train=False, transform=ToTensor())
        image, label = test_data[random.randint(0, len(test_data)-1)]
        return image

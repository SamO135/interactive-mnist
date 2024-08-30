from network.neural_network import Network
from torch import Tensor
from torchvision import datasets
from torchvision.transforms import ToTensor
import torch.nn.functional as F
import torch
import random
from schema import *
import numpy as np


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

    def random_image(self) -> Tensor:
        """Gets a random image from MNIST test set for testing/debugging purposes."""
        test_data = datasets.MNIST(root='core/network/data',
                                   train=False, transform=ToTensor())
        image, label = test_data[random.randint(0, len(test_data)-1)]
        return image

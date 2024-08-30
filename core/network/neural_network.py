import torch.nn as nn


class Network(nn.Module):
    def __init__(self):
        super(Network, self).__init__()
        self.net = nn.Sequential(
            # 1x28x28
            nn.Conv2d(in_channels=1, out_channels=6,
                      kernel_size=5, stride=1, padding=2),
            # 6x28x28
            nn.ReLU(),
            nn.AvgPool2d(kernel_size=2, stride=2),
            # 6x14x14
            nn.Conv2d(in_channels=6, out_channels=16,
                      kernel_size=5, stride=1, padding=0),
            # 16x10x10
            nn.ReLU(),
            nn.AvgPool2d(kernel_size=2, stride=2),
            # 16x5x5
            nn.Flatten(),
            nn.Linear(in_features=5*5*16, out_features=120),
            nn.Linear(in_features=120, out_features=84),
            nn.Linear(in_features=84, out_features=10),
        )

    def forward(self, x):
        x = self.net(x)
        return x

import torch
import torch.nn as nn
from torchvision import datasets
from torchvision.transforms import ToTensor
from .neural_network import Network

# Load the MNIST data
train_data = datasets.MNIST(root='core/network/data', train=True,
                            transform=ToTensor(), download=True)
test_data = datasets.MNIST(root='core/network/data',
                           train=False, transform=ToTensor())

# Make dataloaders
train_loader = torch.utils.data.DataLoader(
    train_data, batch_size=100, shuffle=True, num_workers=1)
test_loader = torch.utils.data.DataLoader(
    test_data, batch_size=100, shuffle=True, num_workers=1)


# Instantiate the model - this initialises all weights and biases
model = Network()


# Train the network
num_epochs = 5
optim = torch.optim.SGD(model.parameters(), lr=0.1)
iterations_per_epoch = len(train_loader)
loss_func = nn.CrossEntropyLoss()

for epoch in range(num_epochs):
    total_loss = 0
    for i, (images, labels) in enumerate(train_loader):
        output = model(images)
        loss = loss_func(output, labels)
        optim.zero_grad()
        loss.backward()
        optim.step()
        if (i+1) % 100 == 0:
            print('Epoch [{}/{}], Iteration [{}/{}], Loss: {:.4f}'.format(epoch +
                  1, num_epochs, i + 1, iterations_per_epoch, loss.item()))
        total_loss += loss
    print('Total loss over epoch {}: {:.2f}'.format(epoch+1, total_loss))


# Test the network
correct = 0
total = 0
for images, labels in test_loader:
    output = model(images)
    pred_y = torch.argmax(output, 1)
    correct += (pred_y == labels).sum()
    total += float(labels.size(0))
accuracy = correct/total
print('Test Accuracy of the model on the 10000 test images: %.2f' % accuracy)

# Save model weights
torch.save(model.state_dict(), 'core/network/model_weights.pkl')

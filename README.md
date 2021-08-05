
# Handwritten Digit Recognition with CNN
![handwritten digit recognition]https://raw.githubusercontent.com/dmnlgn/Handwritten-Digit-Recognition-with-CNN/main/public/images/digit-recognition-test.gif
## Installation

### Requirements

- [Node.js](https://nodejs.org/en/) ver. 10+.
- [yarn](https://yarnpkg.com/)

### Clone this repository to your local computer

```bash
git clone https://github.com/dmnlgn/handwritten-digit-recognition-CNN.git
```

## Configuration

The `data.js` file contains the absolute path to the dataset, so you have to change it in the cloned repository.
```javascript
const datasetPath = "file:///GIT/portfolio/handwritten-digit-recognition-CNN/dataset/";
```

## Training mode
### Partial trainining
```bash
node app.js --train_mode=0 --epochs=10 --batch_size=64
```
### Full training with saving the model
```bash
node app.js --train_mode=1 --epochs=10 --batch_size=64 --model_save_path=file://./public/assets/model
```

## Front-end
### Launch locally
```bash
yarn start
```
Open http://localhost:3000/ with your browser

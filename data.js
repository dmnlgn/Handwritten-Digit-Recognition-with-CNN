const tf = require('@tensorflow/tfjs-node');

const datasetPath = "file:///GIT/portfolio/handwritten-digit-recognition-CNN/dataset/";
const trainData = `${datasetPath}train.csv`;

const imageWidth = 28;
const imageHeight = 28;
const imageChannel = 1;
const layersNumber = 10;

const dataSize = 42000;
const trainTestDataSize = 38000;
const testDataSize = dataSize - trainTestDataSize;

const tensorData = [];
const label = [];

// --- load train data function ---
const loadData = async () => {
    const csvDataSet = tf.data.csv(trainData, {
        columnConfigs: {
            label: {isLabel: true}
        }
    });
    await csvDataSet.forEachAsync(row => process(row));
}

// --- push data ---
const process = async (row) => {
    tensorData.push(Object.values(row['xs']));
    label.push(Object.values(row['ys'])[0]);
}

exports.MnistClass = class MnistDataset {
    constructor() {
        this.Xtrain = null;
        this.Xval = null;
        this.Ytrain = null;
        this.Ytest = null;
    }

    async startDataLoading(trainMode) {
        await loadData();
        if (trainMode == 0) {
            this.Xtrain = tf.tensor(tensorData.slice(0, trainTestDataSize)).reshape([trainTestDataSize, imageHeight, imageWidth, imageChannel]).div(255.0)
            this.Xtest = tf.tensor(tensorData.slice(trainTestDataSize)).reshape([testDataSize, imageHeight, imageWidth, imageChannel]).div(255.0)
            this.ytrain = tf.oneHot(tf.tensor1d(label.slice(0, trainTestDataSize), 'int32'), layersNumber);
            this.ytest = tf.oneHot(tf.tensor1d(label.slice(trainTestDataSize), 'int32'), layersNumber);
        } else {
            this.Xtrain = tf.tensor(tensorData).reshape([dataSize, imageHeight, imageWidth, imageChannel]).div(255.0);
            this.Ytrain = tf.oneHot(tf.tensor1d(label, 'int32'), layersNumber);
        }
    }
}



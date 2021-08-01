const tf = require('@tensorflow/tfjs-node');
const data = require('./data');

const image_width = 28;
const image_height = 28;
const image_channel = 1;

const getModel = () => {
    const model = tf.sequential();

    model.add(tf.layers.conv2d({
        inputShape: [image_width, image_height, image_channel],
        filters: 32,
        kernelSize: 3,
        activation: 'relu'
    }));
    model.add(tf.layers.conv2d({
        filters: 32,
        kernelSize: 3,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2]
    }));
    model.add(tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2]
    }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dropout({
        rate: 0.25
    }));
    model.add(tf.layers.dense({
        units: 512,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: 10,
        activation: 'softmax'
    }));

    model.compile({
        optimizer: 'rmsprop',
        loss: 'categoricalCrossentropy',
        metrics: 'accuracy'
    });

    return model;
}

exports.trainModel = async(args) => {
    const CNN_model = getModel();
    const trainMode = args.trainMode;

    mnist = data.MnistClass;
    dataset = new mnist;

    if (trainMode == 0) {
        //partial training with train and test set
        dataset.startDataLoading(trainMode).then(async () => {
            console.log("\n[DATA LOADED SUCCESFULLY]");
            await CNN_model.fit(dataset.Xtrain, dataset.Ytrain, {
                epochs: args.epochs,
                batchSize: args.batchSize,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: async (epoch, logs) => {
                        console.log(`\nepoch: ${epoch+1}\ntrain accuracy: ${(logs.acc * 100).toFixed(2)}\nval accuracy: ${(logs.val_acc * 100).toFixed((2))}\n`);
                    }
                }
            })

            console.log("[TESTING ON FINAL TEST SET]");
            const eval = CNN_model.evaluate(dataset.Xtest, dataset.Ytest);
            console.log(`test loss: ${(eval[0].datasync()[0]).toFixed(3)}\ntest accuracy: ${(eval[1].dataSync()[0] * 100).toFixed(2)}\n`);
        })
    } else {
        //full mode training
        dataset.startDataLoading(trainMode).then(async () => {
            console.log("\n[FULL DATA LOADED SUCCESFULLY]");
            await CNN_model.fit(dataset.Xtrain, dataset.Ytrain, {
                epochs: args.epochs,
                batchSize: args.batch_size,
                callbacks: {
                    onEpochEnd: async (epoch, logs) => {
                        console.log(`\nepoch: ${epoch+1}\ntrain accuracy: ${(logs.acc * 100).toFixed(2)}\n`);
                    }
                }
            })
            console.log("\n------------------------------");
            console.log(`saving model to ${args.model_save_path}...`);
            await CNN_model.save(args.model_save_path);
            console.log(`saved model to ${args.model_save_path}`);
        })
    }
}
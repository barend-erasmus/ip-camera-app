const moment = require('moment');
const request = require('request');
const jpeg = require('jpeg-js');
const Jimp = require('jimp');

function capture(url) {
    getSnapshot(url, function (err1, image1) {
        if (err1) {
            console.log(err1);
            reCapture(url);
        } else {
            setTimeout(() => {
                getSnapshot(url, function (err2, image2) {
                    if (err1) {
                        console.log(err2);
                        reCapture(url);
                    } else {
                        const diff = Jimp.diff(image1, image2, 0.1);
                        console.log(diff.percent);

                        if (diff.percent > 0.05) {
                            diff.image.write(`./images/diff_${moment().format('YYYY_MM_DD_HH_mm_ss')}.jpg`);
                            image2.write(`./images/image2_${moment().format('YYYY_MM_DD_HH_mm_ss')}.jpg`);
                            console.log('logged');
                        }
                        capture(url);
                    }
                });
            }, 100);
        }
    });
}

function reCapture(url) {
    setTimeout(() => {
        capture(url);
    }, 50);
}

function getSnapshot(url, callback) {
    request({
        url,
        headers: {
            'User-Agent': 'request'
        },
        encoding: null,
    }, (error, response, body) => {
        try {
            const rawImageData = jpeg.decode(body);

            Jimp.read(body, (err, image) => {
                callback(null, image);
            });
        } catch (err) {
            getSnapshot(url, callback);
        }
    });
}

capture('http://197.88.50.183:300/snapshot.cgi?user=admin&pwd=123456&next_url=tempsnapshot.jpg')
const redis = require("redis");
const instance = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

const processq = async (callback) => {
    await instance.lrange('evoucher_order_payment_success_pipe', 0, 0,
        async (err, reply) => {
            if (err) {
                console.log(err)
                return
            }
            await callback(reply[0][0] === "{" && JSON.parse(reply[0]))
            instance.lpop(['evoucher_order_payment_success_pipe'],
                (err, reply) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log("POPPED", reply);
                });
        });
}

const checkq = () => new Promise((resolve, reject) => instance.lrange('evoucher_order_payment_success_pipe', 0, 0,
    (err, reply) => {
        if (err) reject(err)
        if (reply.length) {
            resolve(true)
        }
        else {
            resolve(false)
        }
    })
)




const spinupQueue = new Promise((resolve, reject) => {
    // redisClient.on("error", (err) => {
    //     console.log("error", err)
    // });

    // redisClient.on("connect", (err) => {
    //     console.log("connect");
    // });

    instance.on("ready", (err) => {
        if (err) reject()
        console.info('- QUEUE READY');
        resolve();
    });
})

exports.spinupQueue = spinupQueue
exports.processq = processq
exports.checkq = checkq
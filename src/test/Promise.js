

// _Promise存在三个状态（state）pending、fulfilled、rejected


// pending（等待态）为初始态，并可以转化为fulfilled（成功态）和rejected（失败态）


// 成功时，不可转为其他状态，且必须有一个不可改变的值（value）


// 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）


// new _Promise((resolve, reject)=>{resolve(value)}) resolve为成功，接收参数value，状态改变为fulfilled，不可再次改变。


// new _Promise((resolve, reject)=>{reject(reason)}) reject为失败，接收参数reason，状态改变为rejected，不可再次改变。


// 若是executor函数报错 直接执行reject();

// then 方法  return 结果后需要被下个方法接收，并且可以直接 new p.then 进行调用


class Promise {
    constructor(execute) {
        this.state = 'pending' // pending rejected fulfilled
        this.value = '';
        this.reason = '';
        this.onFulfilledCallBacks = [];
        this.onRejectedCallBacks = [];

        console.log('start')


        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallBacks.forEach(fn => fn(this.value));
            }
        }

        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallBacks.forEach(fn => fn(this.reason))
            }
        }

        try {
            execute(resolve, reject);
        }
        catch (e) {
            reject(e);
        }

    }

    catch = () => { }

    finally = () => { }

    then = (onFulfilled, onRejected) => {

        const promise2 = new Promise((resolve, reject) => {


            if (this.state === 'fulfilled') {

                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);

            }

            if (this.state === 'rejected') {

                setTimeout(() => {
                    try {
                        onRejected(this.reason)
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);

            }

            if (this.state === 'pending') {


                if (typeof onFulfilled === 'function') {
                    this.onFulfilledCallBacks.push(() => {

                        setTimeout(() => {
                            try {
                                const x = onFulfilled(this.value);

                                resolvePromise(promise2, x, resolve, reject);
                            }
                            catch (e) {
                                onRejected(e);
                            }
                        }, 0)

                    });

                }

                if (typeof onRejected === 'function') {
                    this.onRejectedCallBacks.push(() => {

                        setTimeout(() => {
                            try {
                                const x = onRejected(this.reason);

                                resolvePromise(promise2, x, resolve, reject);
                            }
                            catch (e) {
                                onRejected(e);
                            }
                        })

                    });

                }


            }

        });

        return promise2;

    }


};
// 这里是否要判断 promise2 的状态， 若 onRejected 的话， 就不能再次调用 resolve

const resolvePromise = (promise, x, resolve, reject) => {

    if (x === promise) return reject(TypeError('不能 循环引用'));

    if (typeof x.then === 'function') {
        const called = false;

        try {
            const then = x.then;

            then.call(x,
                (v) => {
                    if (called) return;
                    called = true;
                    resolvePromise(x, v, resolve, reject);
                },
                (e) => {
                    if (called) return;
                    called = true;
                    resolvePromise(x, e, resolve, reject);
                }
            )
        }
        catch (e) {
            reject(e);
        }
    }
    else {
        resolve(x);
    }

}

//resolve方法
Promise.resolve = function(val){
    return new Promise((resolve,reject)=>{
      resolve(val)
    });
  }
  //reject方法
  Promise.reject = function(val){
    return new Promise((resolve,reject)=>{
      reject(val)
    });
  }
  //race方法 
  Promise.race = function(promises){
    return new Promise((resolve,reject)=>{
      for(let i=0;i<promises.length;i++){
        promises[i].then(resolve,reject)
      };
    })
  }
  //all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
  Promise.all = function(promises){
    let arr = [];
    let i = 0;
    function processData(index,data){
      arr[index] = data;
      i++;
      if(i == promises.length){
        Promise.resolve(arr);
      };
    };
    return new Promise((resolve,reject)=>{
      for(let i=0;i<promises.length;i++){
        promises[i].then(data=>{
          processData(i,data);
        },reject);
      };
    });
  }
  

  Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve,reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  }
  module.exports = Promise;
  

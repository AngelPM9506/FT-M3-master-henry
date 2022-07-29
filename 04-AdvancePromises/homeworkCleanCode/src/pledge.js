'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
class $Promise {
    constructor(executor) {
        if (typeof (executor) !== 'function')
            throw new TypeError('Executor is not a function');
        this._state = 'pending';
        this._handlerGroups = [];
        executor(
            data => this._internalResolve(data),
            raseon => this._internalReject(raseon)
        );
    }
    _changeState(state, data) {
        if (this._state === 'pending') {
            this._state = state;
            this._value = data;
            this._callHandlers();
        }
    }
    _internalResolve(data) {
        this._changeState('fulfilled', data);
    }
    _internalReject(raseon) {
        this._changeState('rejected', raseon);
    }
    then(successCb, errorCb) {
        if (typeof (successCb) !== 'function')
            successCb = false;
        if (typeof (errorCb) !== 'function')
            errorCb = false;
        var downstreamPromise = new $Promise(() => { });
        this._handlerGroups.push({
            successCb: successCb,
            errorCb: errorCb,
            downstreamPromise
        });
        this._callHandlers();
        return downstreamPromise;
    }
    catch(errorCb) {
        return this.then(null, errorCb);
    }
    _callHandlers() {
        if (this._state !== 'pending') {
            while (this._handlerGroups.length > 0) {
                const { successCb, errorCb, downstreamPromise } = this._handlerGroups.shift();
                if (this._state === 'fulfilled') {
                    if (successCb) {
                        try {
                            let respuesta = successCb(this._value);
                            if (respuesta instanceof $Promise) {
                                respuesta.then(
                                    data => downstreamPromise._internalResolve(data),
                                    reason => downstreamPromise._internalReject(reason)
                                );
                            } else {
                                downstreamPromise._internalResolve(respuesta);
                            }
                        } catch (error) {
                            downstreamPromise._internalReject(error);
                        }
                    } else {
                        downstreamPromise._internalResolve(this._value);
                    }
                }
                if (this._state === 'rejected') {
                    if (errorCb) {
                        try {
                            let respuesta = errorCb(this._value);
                            if (respuesta instanceof $Promise) {
                                respuesta.then(
                                    data => downstreamPromise._internalResolve(data),
                                    reason => downstreamPromise._internalReject(reason)
                                );
                            } else {
                                downstreamPromise._internalResolve(respuesta);
                            }
                        } catch (error) {
                            downstreamPromise._internalReject(error);
                        }
                    } else {
                        downstreamPromise._internalReject(this._value);
                    }
                }
            }
        }
    }
    static resolve(promise) {
        if (promise instanceof $Promise) {
            return promise;
        } else {
            return new $Promise((res) => {
                res(promise)
            });
        }
    }
    static all(arrayItems) {
        if (!Array.isArray(arrayItems)) throw new TypeError('All method only acept array');

        let numOfPromises = arrayItems.length;
        let numOfPromisesResolved = 0;
        let arrayOfResults = new Array(numOfPromises);
        return new $Promise((resolve, reject) => {
            arrayItems.forEach((item, i) => {
                if (item instanceof $Promise) {
                    item.then(resolve => {
                        numOfPromisesResolved++;
                        arrayOfResults[i] = resolve;
                        if (numOfPromisesResolved === numOfPromises) resolve(arrayOfResults);
                    }, reject);
                } else {
                    numOfPromisesResolved++;
                    arrayOfResults[i] = item;
                    if (numOfPromisesResolved === numOfPromises) resolve(arrayOfResults);
                }
            });
        })
    }
}



module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/

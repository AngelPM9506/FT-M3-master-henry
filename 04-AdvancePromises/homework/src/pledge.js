'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
/**Declaracion de la clase */

class $Promise {
    /**Definimos el contructor */
    constructor(executor) {
        /**Verificamos que el executor sea una funcion**/
        if (typeof(executor) !== 'function') {
            /**si no es una funcion retornamos un error*/
            throw new TypeError('executor no es una function');
        }
        /**Se inicializa el estado */
        this._state = 'pending';
        this._handlerGroups = [];
        /**se manda a llamar el executor con dos argumentos que a la vez son 
         * callback que mandaran a llamar respectivamente al resolve o al Reject
         * y una vez que se tiene esta parte todo lo siguiente progresa por si solo
         */
        executor(
            data => this._internalResolve(data),
            reason => this._internalReject(reason)
        );
    }
    /**en este caso yo  cree una tercera funcion para saber si en algun momento ya se habia 
     * modificado el estado y si no se modifico el estado previamente se asignan los valores 
     * requeridos.
     */
    _changeState = (state, value) => {
        if (this._value === undefined && this._state === 'pending') {
            this._value = value;
            this._state = state;
        }
    }
    /**funciones de resolucion y rechaso
     * y dentro de las mismas se manda a llamar a la funcion que otorgara el estado y el valor
     */
    _internalResolve = data => {
        this._changeState('fulfilled', data);
        /**para la parte dos se se manda allamar desde aqui al _callHandlers pera el proceso inverso*/
        this._callHandlers();
    }
    _internalReject = reason => {
        this._changeState('rejected', reason);
        /**para la parte dos se se manda allamar desde aqui al _callHandlers pera el proceso inverso*/
        this._callHandlers();
    }
    /**agregamos la funcion then */
    then = (success, error) => {
        /**comporbamos que los dos argumentos recibidos sean funciones */
        if (typeof (success) !== 'function') success = false;
        if (typeof (error) !== 'function') error = false;
        /**se crea una nueva promesa para ser llamada en el _callHandlers y retornar la 
         * en esta misma funcion
        */
        //let promiseToReturn = new $Promise((res, rej) => { });
        let downstreamPromise = new $Promise((res, rej) => { }); //-> el test solicita su propio nombre
        /**agregamos las dos funciones al _handlerGroups
         * * se agrega tambien se agrega la nueva promesa a rornar para que se pueda usar 
         * * en la parte del _callHandlers donde sea necesario. 
        */
        this._handlerGroups.push({
            successCb: success,
            errorCb: error,
            //promiseToReturn
            downstreamPromise
        });
        /**Se invoca al _callHandlers pero como el then solo debe funcionar una vez
         * que se termina la promesa, confirmamos que el estatus sea diferente de 
         * pendindg. 
         */
        if (this._state !== 'pending') {
            this._callHandlers();
        }
        /**retornamos el resultado de la promesa hecha anteriormente */
        return downstreamPromise;
    }
    /**llamado a los Handlers almacenados */
    _callHandlers = () => {
        /**iremos sacando uno a uno los elementos del _handlerGroups que en teoria solo tenemos uno 
         * por lo tanto solo se ejecutara una vez pero de lo contrario iremos resolviendo uno a uno 
         * de los elementos que encontremos
         */
        while (this._handlerGroups.length > 0) {
            /**obtenemos el primer item de _handlerGroups */
            let elemento = this._handlerGroups.shift();
            /**dependiendo del estado en el que se encuntre la promesa actualmente aremos una o otrea cosa*/
            /**si esta en aprobada */
            if (this._state === 'fulfilled') {
                /**ahora comprobamos si tenemos algo en el handler success ya que recordemos que en caso de 
                 * no tener una funcion lo colocariamo un false por lo tanto sis esta en falce tendremos que 
                 * ejecutar el promise extra que habiamos hecho en nuestro valor actual
                */
                if (elemento.successCb) {
                    /**si tenemos una funcion la ejecutaremos pero en este punto tambien podemos tener algun error
                     * y como no esta determinado el error que pueda suceder al ejecutar la funcion almacenada lo 
                     * que aremos es utilizar un try catch para capturar cualquier error que pueda surgir
                     */
                    try {
                        /**ahora es necesario obtener el resultado de ejecutar la funcion success para retornarlo
                         * pero tenemos tres posibilidades de tipo de rultado, un valor , una funcion o un error
                        */
                        let resultado = elemento.successCb(this._value);
                        /**comprobar que si el resultado es una nueva instancia o es un valor*/
                        if (resultado instanceof $Promise) {
                            /**si tenemos una nueva instancia retornaremos un nuevo then */
                            return resultado.then(
                                data => elemento.downstreamPromise._internalResolve(data),
                                reason => elemento.downstreamPromise._internalReject(reason)
                            );
                        } else {
                            /**si no es una instancia retornamos el valor como resolve**/
                            elemento.downstreamPromise._internalResolve(resultado);
                        }
                    } catch (error) {
                        /**si tenemos un error lo regresamos com un rejected de la promesa que se retornara */
                        elemento.downstreamPromise._internalReject(error);
                    }
                } else {
                    elemento.downstreamPromise._internalResolve(this._value);
                }
            }
            /**si esta rechazada */
            if (this._state === 'rejected') {
                /**se repite el proceso de fullfield  */
                if (elemento.errorCb) {
                    try {
                        let resultado = elemento.errorCb(this._value);
                        if (resultado instanceof $Promise) {
                            return resultado.then(
                                data => elemento.downstreamPromise._internalResolve(data),
                                reason => elemento.downstreamPromise._internalReject(reason)
                            );
                        } else {
                            elemento.downstreamPromise._internalResolve(resultado)
                        }
                    } catch (error) {
                        elemento.downstreamPromise._internalReject(error);
                    }
                } else {
                    elemento.downstreamPromise._internalReject(this._value);
                }
            }
        }
    }
    /**Metodo Catch */
    catch = error => {
        return this.then(null, error);
    }
    /**metodo Resolve */
    static resolve = value => {
        let NewPromise;
        if (value instanceof $Promise) {
            NewPromise = value;
        } else {
            NewPromise = new $Promise((res) => {
                res(value)
            });
        }
        return NewPromise;
    }
    /**metodo all */
    static all = array => {
        /**1.- riene que ser un array forsosamente */
        if (!Array.isArray(array)) {
            throw new TypeError('.all Solo funciona con arrays')
        };
        var promise = new $Promise((res, rej) => {
            /**es necesario saber cuantos items tenemos en el array */
            const numOfPromises = array.length;
            /**cuantos items vamos resolviendo */
            let reslPrmises = 0;
            /**almacenar los resultados */
            const result = new Array(numOfPromises);
            /**Recorrer item por item y saber ques */
            array.forEach((prom, ind) => {
                /**si tenemos unsa isntancia de la promesa */
                if (prom instanceof $Promise) {
                    /**mandamos a llamar su the para realizar las acciones */
                    prom.then(value => {
                        /**sumamos en uno la cantidad de items una vez que se obtiene el resultado */
                        reslPrmises++;
                        /**uanvez que se obtiene el resultado lo adjuntamos en roden al array de 
                         * resultados
                         */
                        result[ind] = value;
                        /**si ya tenemos la misma cantidad de resultados que de item 
                         * hacemos un result con el array de resultados
                        */
                        if (numOfPromises === reslPrmises) {
                            res(result);
                        }
                    }, rej);
                } else {
                    /**en caso contraio de no tener una instancia de promise solo repetimos las 
                     * mismas acciones anteriores pero con la diferencia de de no llamar al the 
                     * y pasar directamente el valor a los resultados que se retornaran
                     */
                    reslPrmises++;
                    result[ind] = prom;
                    if (numOfPromises === reslPrmises) {
                        res(result);
                    }
                }
            });
        });
        return promise;
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
/**
 * 
        let NewPromiseArray, arrayvalues = [];
        if (!Array.isArray(array)) {
            throw new TypeError('Es necesario un array');
        }
        for (let i = 0; i < array.length; i++) {
            if (array[i] instanceof $Promise) {
                if (array[i]._state === 'pending') {
                    array[i].then((val, err) => {
                        arrayvalues.push(val)
                    });
                } else {
                    arrayvalues.push(array[i]._value);
                }
            } else {
                arrayvalues.push(array[i]);
            }
        }
        console.log(` arrayvalues ->`);
        console.log(arrayvalues);
        NewPromiseArray = new $Promise((res, rej) => {
            res(arrayvalues)
        });
        return NewPromiseArray;
 */
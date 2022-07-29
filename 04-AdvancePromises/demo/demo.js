// ---------------REPASO----------------------------
​
// const pA = new Promise(function(resolve, reject){
//     setTimeout(() => {
//         //resolve('Se resolvio A');
//         reject('Se rechaso A')
//     }, 1000)
// });
// console.log('1: ', pA); // que me va a mostrar?
​
// pA.then(data => {
//     console.log('2: ', data) // que me va a mostrar?
// }, err => {
//     console.log('3: ', err)
// });
​
​
    
​
// Y si se rechaza?
​
//----------------------------------------------------
//---------------- FLOWCHART--------------------------
​
// const pA = new Promise(function(resolve, reject){
//     setTimeout(() => {
//         resolve('Se resolvio A');
//         // reject('Se rechaso A')
//     }, 1000)
// });
 // -------------------------------------------------
​
//  const pB = pA.then();
​
//  console.log('1: ', pB); // que muestra?
​
//  pB.then(data => {
//     console.log('2: ', data)
//  })
​
//-----------------------------------------------------
​
// pA
// .then() // pB -> resolve(se resolvio A)
// .then() // pC -> resolve(se resolvio A)
// .then() // pD -> resolve(se resolvio A)
// .then(data => {
//     console.log('1 ', data)
// }) 
// .then(null, err=> {
//     console.log('2 ', err)
// })
​
//------------------------------------------------------
​
// pA
// .then(data => {
//     console.log('1: ', data)
//     return 'holiiisss!' 
   
// })
// .then(data => {
//     console.log('2: ', data)
// })
// .catch( err => {
//     console.log('3: ', err)
//    return err
// })
// .then(data => {
//     console.log('4: ', data)
// })
​
//------------------------------------------------------------
​
// pA
// .then(data => {
//     console.log('1: ', data) //
//     return new Promise(function(resolve, reject){
//         setTimeout(() => {
//             //resolve('SE RESOLVIO ESTA OTRA')
//             reject('Se rechazo esta otra')
//         }, 1000)
//     })
// })
// .then(data => {
//     console.log('2: ', data)
//     return data.toLowerCase()
// })
// .then(data => {
//     console.log('3: ', data)
    
// })
// .then(null, err => {
//     console.log('4: ', err)
// })
​
//-------------------------------------------
​
// pA
// .then(data => {
//     console.log('1: ', data) //
//     throw new TypeError('ROMPIO!!!!')
// })
// .then(data => {
//     console.log('2: ', data) // 
// })
// .then(null, err => {
//     console.log('3: ', err) //
// })
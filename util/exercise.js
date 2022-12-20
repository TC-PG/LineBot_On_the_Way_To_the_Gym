const { PythonShell} = require('python-shell');

const ExerciseUtil = {};

// const execute = async (exerciseNumber, duration) => {
//     let options = {
//         mode: 'text',    
//         args: [exerciseNumber, duration]
//       };
//     // TODO: 請換成M5stickC python程式
//     PythonShell.run('./util/plot_test.py', options, function (err) {
//         if (err) {
//             console.log(err);
//         }
//       });    
// }

const execute = (exerciseNumber, duration) => {
    return new Promise((resolve, reject) =>{
        let options = {
            mode: 'text',    
            args: [exerciseNumber, duration]
        };
        // TODO: 請換成M5stickC python程式
        PythonShell.run('./util/plot_test.py', options, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });  
    });
}

const sleep = (time) => {
    return new Promise(resolve => setTimeout(resolve, time * 60 * 1000));
} 

ExerciseUtil.execute = execute;
ExerciseUtil.sleep = sleep;
  
module.exports = ExerciseUtil;
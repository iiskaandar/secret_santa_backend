
import { setDrawnPersonById } from '../controllers/usercontroller';

const randomSanta = (usersArray) => (
    new Promise((resolve, reject) => {
        var arr1 = usersArray.slice(), // copy array
        arr2 = usersArray.slice(); // copy array again

        arr1.sort(function() { return 0.5 - Math.random();}); // shuffle arrays
        arr2.sort(function() { return 0.5 - Math.random();});
        let arrayOfPairs = []
        while (arr1.length) {
            var firstId = arr1.pop(), // get the last value of arr1
            secondId = arr2[0] == firstId ? arr2.pop() : arr2.shift();
            //        ^^ if the first value is the same as name1, 
            //           get the last value, otherwise get the first

            console.log(firstId + ' gets ' + secondId);
            arrayOfPairs.push({firstId, secondId})
        }
        console.log(arrayOfPairs)
        setDrawnPersonById(arrayOfPairs)
        resolve('success')
    })
)



export {
    randomSanta
};

import { setDrawnPersonById } from '../controllers/usercontroller';

const randomSanta = (usersArray, pairDictNotToDraw) => (
    new Promise((resolve, reject) => {
        var finishDrawing = false
        var arrayOfPairs = []
        while(!finishDrawing){
            finishDrawing = true
            var arr1 = usersArray.slice(),
            arr2 = usersArray.slice();
    
            arr1.sort(function() { return 0.5 - Math.random();});
            arr2.sort(function() { return 0.5 - Math.random();});
            arrayOfPairs = []
            while (arr1.length) {
                const firstId = arr1.pop()
                const firstIdString = firstId.toString()
                const personNotToDraw = pairDictNotToDraw[firstIdString]
                console.log('person not to draw')
                console.log(personNotToDraw)
                let secondId
                if(personNotToDraw){
                    if (arr2[0] == firstId){
                        if(arr2[arr2.length - 1] !== firstId && arr2[arr2.length - 1] !== personNotToDraw){
                            secondId = arr2.pop()
                        }
                    } else if (arr2[0] !== personNotToDraw) {
                        secondId = arr2.shift()
                    }
                } else {
                    secondId = arr2[0] == firstId ? arr2.pop() : arr2.shift();
                }

                arrayOfPairs.push({firstId, secondId})
            }
            arrayOfPairs.forEach(({secondId}) => {
                if(!secondId){
                    finishDrawing = false
                }
            })
        }

        setDrawnPersonById(arrayOfPairs)
        resolve('success')
    })
)



export {
    randomSanta
};
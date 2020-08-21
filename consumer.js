const axios = require('axios')
const express = require('express')
const app = express();
const async = require('async')

const callback = (value) =>{
    //console.log('callback')
    if(value.data[0]){
      //  console.log(value.data[0].id)
    }
    
}

app.get('/consumeSeries', (request, response)=>{
    const totalRecords = 100;
    const offset = 10;
    const iteration = (totalRecords/offset) + 1;
    let indices = [];
    for(let index =0; index < iteration; index ++){
        indices.push({
            "startIndex" : index * offset,
            "offset" : offset
        })
    }
    var hrstart = process.hrtime()
    async.eachSeries(indices, async (index) =>{
        //console.log('called fetchproducerdata ', index.startIndex, index.offset );
        var url = 'http://localhost:3000/produceData/'+index.startIndex+'/'+index.offset;
        var value = await axios.get(url);
        callback(value)
    }, (error)=>{
        if(error){
            console.log('some error has occured.'+ error.message)
        }else{
            console.log('all data has been fetched Series')
        }
        var hrend = process.hrtime(hrstart)
        console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    })
    

response.sendStatus(200)

});




app.get('/consumeParallel', (request, response)=>{
    const totalRecords = 100;
    const offset = 10;
    const iteration = (totalRecords/offset) + 1;
    let indices = [];
    for(let index =0; index < iteration; index ++){
        indices.push({
            "startIndex" : index * offset,
            "offset" : offset
        })
    }
    var hrstart = process.hrtime()
    async.each(indices, async (index) =>{
        //console.log('called fetchproducerdata ', index.startIndex, index.offset );
        var url = 'http://localhost:3000/produceData/'+index.startIndex+'/'+index.offset;
        var value = await axios.get(url);
        callback(value)
    }, (error)=>{
        if(error){
            console.log('some error has occured.'+ error.message)
        }else{
            console.log('all data has been fetched Parallel')
        }
        var hrend = process.hrtime(hrstart)
        console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    })
    

response.sendStatus(200)

});


app.listen(3001, ()=>{
    console.log('consumer started on port 3001');
})
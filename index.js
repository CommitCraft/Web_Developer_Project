// console.log("Hello World");
// console.log(!"Hello");
// console.log(!false);


// function abc(){
//     "use state";
//     asd="vipin";
//     console.log(asd);  
// }

// abc();


// const a={
//     name:"Vipin"
// }
// const b={
//     ...a,
//     name:"Kumar"
// }
// const c={
//     name:b.name
// }

// console.log(b);

// let count=1;
// let num=[0,1,2,3,4]
// num.forEach(item=>{
//     count=count+1
// })
// console.log(count);

function test1(record){
    if(JSON.stringify(record)===JSON.stringify({age:26})){
        console.log("record is 26");
    }else if(JSON.stringify(record)===JSON.stringify({age:28})){
        console.log("record is 28");
    }else{
        console.log("record is not 26 or 28");
    }
}

test1({age:28});
module.exports=()=>{
    let number=0;
    for(let i=0;i<4;i++){
        let digit=Math.random()*10
        number=number*10+digit;
    }

    return Math.round(number);
}
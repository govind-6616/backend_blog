const mongoose=require('mongoose');
const DB="mongodb+srv://govind:asdfghjk@cluster0.n1lsmgu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//const DB="mongodb://localhost:27017/blog";
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('Connection Successful');
}).catch((err)=>{
    console.log(err);
}
);

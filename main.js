const http=require('http');
const mysql=require('mysql');
const fs=require('fs');
const url=require('url');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'12345678',
    database:'demo',
    charset:'utf8_general_ci'
})
connection.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('connect success');
    }
});
const server=http.createServer((req,res)=>{
    let urlParse=url.parse(req.url,true);
    let urlPath=urlParse.pathname;
    switch (urlPath){
        case '/':
            showHTML(req,res,'view/home.html');
            break;
        case '/product':
            showProduct(req,res);
            break;
        case `/product/delete`:
            deleteProduct(req,res);
            showProduct(req,res);
            break;
        case `/product/edit`:
            break;
        default:
            showHTML(req,res,'view/error.html');
            break;
    }
})
server.listen(8080,()=>{
    console.log('local host run in http://localhost:8080/');
});

function deleteProduct(req,res){
    let urlParse = url.parse(req.url, true);
    let queryString=urlParse.query;
    let id=queryString.id;

    connection.query(`delete from product where id=${id}`,(err,data)=>{
        if(err) {
            console.log(err);
        }
    })
}
function addProduct(){

}
function showHTML(req,res,path){
    fs.readFile(path,'utf-8',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(data);
            return res.end();
        }
    })
}
function getProduct(){
    return new Promise((resolve,reject)=>{

        connection.query('select * from product;',(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })

}
function showProduct(req,res){

    fs.readFile('view/product.html','utf-8',async (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let products = await getProduct();

            let tbody='';
            for(let i=0;i<products.length;i++){
                tbody+=` <tr>
                    <td>${products[i].productCode}</td>
                    <td>${products[i].productName}</td>
                    <td>${products[i].productPrice}</td>
                    <td>${products[i].productAmount}</td>
                    <td>${products[i].productStatus}</td>
                    <td><a class="btn btn-danger" href='/product/edit/id=${products[i].Id}'>Edit</a></td>
                    <td><a class="btn btn-danger" href="/product/delete?id=${products[i].Id}">Delete</a></td>
                    
                </tr>`
            }
            data = data.replace('{product}', tbody);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        }
    })
}

const express = require('express')
const SolrNode = require('solr-node');
const bodyParser= require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000

const client = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'Solr_sample',
    protocol: 'http',
    debugLevel: 'ERROR'
});

app.post('/insert', async (req, res) => {
    const data = {
        text: req.body.text,
        title: req.body.title
    };
    console.log(data)
    client.update(data, function(err, result) {
       if (err) {
            res.json({err});
       }
        const response = result.responseHeader;
        res.json({response});
    });
});

app.post('/search', async (req, res) => {
    const text = req.body.text ? req.body.text : '*';
    console.log('text: ' + req.body.text );
    const title = req.body.title ? req.body.title : '*';
    console.log('title: ' + req.body.title );
    let data = {
        text,
        title
    };
    if (text == '*' && title == '*') {
        data = { '*' : '*' };
    }
    console.log(data)
    const objQuery = client.query().q(data)
        .start(5)
        .rows(5);

    try {
        const result = await client.search(objQuery);
        res.json({result});
    } catch (error) {
        res.json({error});
    }
});

app.delete('/delete/:id', async (req, res) => {
    const objQuery = {id:req.params.id}
    
    console.log(objQuery)
    client.delete(objQuery, function(err, result) {
       if (err) {
            res.json({err});
       }
        res.json({result});
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// // Require module
// const SolrNode = require('solr-node');
 
// // Create client
// const client = new SolrNode({
//     host: '127.0.0.1',
//     port: '8983',
//     core: 'Solr_sample',
//     protocol: 'http',
//     debugLevel: 'ERROR' // log4js debug level paramter
// });

// // JSON Data
// const data = {
//     text: 'text dari gentur',
//     title: 'title gentur'
// };

// // Update document to Solr server
// client.update(data, function(err, result) {
//    if (err) {
//       console.log(err);
//       return;
//    }
//    console.log('Response:', result.responseHeader);
// });



// // Create query
// var strQuery = client.query().q('text:text');
// var objQuery = client.query().q({text:'test', title:'test'});
// var myStrQuery = 'q=text:test&wt=json';
 
// // Search documents using strQuery
// client.search(strQuery, function (err, result) {
//    if (err) {
//       console.log(err);
//       return;
//    }
//    console.log('Response:', result.response);
// });
 
// // Search documents using objQuery
// client.search(objQuery, function (err, result) {
//    if (err) {
//       console.log(err);
//       return;
//    }
//    console.log('Response:', result.response);
// //     const response = result.response.docs.map((item) => {
// //         return item.title;
// //     });
// //    console.log('Response:', response);
// });
 
// // Search documents using myStrQuery
// client.search(myStrQuery, function (err, result) {
//    if (err) {
//       console.log(err);
//       return;
//    }
//    console.log('Response:', result.response);
// });



// // Delete Query
// var strQuery = 'id:016bfb60-260c-43c6-a47d-69bde4e6ff34'
// var objQuery = {id:'d2dfe001-9169-4e10-950b-dc61861fa4bf'}
 
// // Delete document using strQuery
// client.delete(strQuery, function(err, result) {
//    if (err) {
//       console.log(err);
//       return;
//    }
//    console.log('Response:', result.responseHeader);
// });
 
// Delete document using objQuery
// client.delete(objQuery, function(err, result) {
//    if (err) {
//       console.log(err);
//       return;
//    }
//    console.log('Response:', result.responseHeader);
// });
// Create web server

// Load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Load comments from file
var comments = require('./comments.json');

// Create web server
http.createServer(function(req, res) {
    // Parse URL
    var parsedUrl = url.parse(req.url);
    var pathname = parsedUrl.pathname;

    // Check request method
    if (req.method === 'GET') {
        // Check pathname
        if (pathname === '/') {
            // Read index.html
            fs.readFile('index.html', 'utf-8', function(err, data) {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('500 Internal Server Error');
                    return;
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            });
        } else if (pathname === '/comments') {
            // Return comments
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(comments));
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 Not Found');
        }
    } else if (req.method === 'POST') {
        // Check pathname
        if (pathname === '/comments') {
            // Read request data
            var body = '';
            req.on('data', function(data) {
                body += data;
            });
            req.on('end', function() {
                // Parse request data
                var params = qs.parse(body);
                var name = params.name;
                var comment = params.comment;
                var date = new Date().toISOString();
                var commentData = {
                    name: name,
                    comment: comment,
                    date: date
                };
                // Add comment
                comments.push(commentData);
                // Save comments to file
                fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('500 Internal Server Error');
                        return;
                    }
                    // Return comments
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(comments));
                });
            });
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end
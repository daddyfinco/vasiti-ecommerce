var express = require('express');
var router = express.Router();

// database module
var database = require('../config/database');
var RunQuery = database.RunQuery;

/* Route Home page. */
router.all('/', function (req, res, next) {
    var sqlStr = '\
        SELECT *\
        FROM Categories';

    RunQuery(sqlStr, function (categories) {
        sqlStr = '\
            SELECT products.*, Categories.CategoryName, Categories.CategorySlug\
            FROM products\
            INNER JOIN Categories\
            ON products.CategoryID = Categories.CategoryID';

        RunQuery(sqlStr, function (products) {
            var contextDict = {
                currentUrl: '/',
                title: 'Home',
                categories: categories,
                featProducts: products,
                customer: req.user
            };

            //isLoggedIn(req, contextDict);
            res.render('index', contextDict);
        });
    });
});

/* Route Category page. */
router.route('/cat/')
    .all(function (req, res, next) {
        var sqlStr = '\
        SELECT *\
        FROM Categories';

        RunQuery(sqlStr, function (categories) {
            var contextDict = {
                currentUrl: '/cat',
                title: 'Categories',
                categories: categories,
                customer: req.user
            };

            res.render('categories', contextDict);
        });
    });

/* Route Category products page. */
router.route('/cat/:catSlug')
    .all(function (req, res, next) {
        if (req.params.catSlug == "all") {
            var selectQuery = '\
                SELECT products.*, Categories.CategoryName, Categories.CategorySlug\
                FROM products\
                INNER JOIN Categories\
                ON products.CategoryID = Categories.CategoryID';

            RunQuery(selectQuery, function (products) {

                selectQuery = '\
                SELECT *\
                FROM Categories';

                RunQuery(selectQuery, function (categories) {

                    var contextDict = {
                        title: 'All products',
                        products: products,
                        categories: categories,
                        customer: req.user
                    };

                    res.render('categoryProducts', contextDict);
                });
            });
        }
        else {
            var sqlStr = '\
                SELECT products.*, Categories.CategoryName, Categories.CategorySlug\
                FROM products\
                INNER JOIN Categories\
                ON products.CategoryID = Categories.CategoryID\
                WHERE Categories.CategorySlug = \'' + req.params.catSlug + '\'';

            RunQuery(sqlStr, function (products) {

                sqlStr = '\
                SELECT *\
                FROM Categories';

                RunQuery(sqlStr, function (categories) {

                    var contextDict = {
                        title: products[0].CategoryName,
                        products: products,
                        categories: categories,
                        customer: req.user
                    };

                    res.render('categoryProducts', contextDict);
                });
            });
        }
    });

/* Route Product page. */
router.route('/cat/:catSlug/:prodSlug')
    .all(function (req, res, next) {
        var sqlStr = '\
        SELECT *\
        FROM products\
        WHERE ProductSlug = \'' + req.params.prodSlug + '\'';

        RunQuery(sqlStr, function (product) {
          product[0].product_varieties = JSON.parse(product[0].product_varieties);
            var contextDict = {
                title: product[0].ProductName,
                product: product[0],
                customer: req.user
            };

            res.render('productDetail', contextDict);
        });
    });

router.route('/subscribe')
    .post(function (req, res, next) {
        var sqlStr = '\
        INSERT INTO Subscribers\
        VALUES (\'' + req.body.email + '\')';

        RunQuery(sqlStr, function (result) {
            res.redirect('/');
        });
    });

/* Route Login page.
 router.route('/login/')
 .get (function (req, res, next) {
 var contextDict = {
 title: 'Login'
 };
 res.render('login', contextDict);
 });

 .post(function (req, res, next) {
 //read inputs
 //validate inputs
 //redirect to account info page
 var contextDict = {
 title: '',
 signInError: req.flash('loginError')
 };
 res.render('template', contextDict);
 });
 */

module.exports = router;

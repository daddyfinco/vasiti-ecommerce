var express = require('express');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

var router = express.Router();

var slug = require('slug');

// database module
var database = require('../config/database');
var RunQuery = database.RunQuery;

function isAdmin(req, res, next) {
  return next();

  // if (req.isAuthenticated()) {
  //     if (req.user.Admin == 1) {
  //         return next();
  //     }
  //     else {
  //         res.redirect('/usr/' + req.user.Username);
  //     }
  // }
  //
  // res.redirect('/');
}

router.route('/')
  .get(isAdmin, function (req, res, next) {
    res.redirect('/admin/products', {layout: 'admin'});
    /*var contextDict = {
     title: 'Admin',
     customer: req.user
     };
     res.render('admin/admin', contextDict);*/
  });

router.route('/cat')
  .get(isAdmin, function (req, res, next) {

    var sqlStr = '\
        SELECT *\
        FROM Categories';

    RunQuery(sqlStr, function (categories) {
      var contextDict = {
        title: 'Admin - Categories',
        categories: categories,
        customer: req.user
      };

      res.render('admin/categories', contextDict);
    });
  });

router.route('/cat/:id/edit')
  .get(isAdmin, function (req, res, next) {

    var sqlStr = '\
        SELECT *\
        FROM Categories\
        WHERE CategoryID = ' + req.params.id;

    RunQuery(sqlStr, function (category) {
      var contextDict = {
        title: 'Admin - Edit Category',
        category: category[0],
        customer: req.user
      };

      res.render('admin/editCat', contextDict);
    });
  })

  .post(isAdmin, function (req, res, next) {
    var sqlStr = '\
        UPDATE Categories\
        SET CategoryName = \'' + req.body.name + '\', \
            Description = \'' + req.body.description + '\', \
            CategorySlug = \'' + slug(req.body.name) + '\' ' +
      /*Image = name.png\*/
      'WHERE CategoryID = ' + req.params.id;

    RunQuery(sqlStr, function (category) {
      res.redirect('/admin/cat');
    });
  });

router.route('/cat/:id/delete')
  .post(isAdmin, function (req, res, next) {
    sqlStr = '\
            DELETE FROM Categories\
            WHERE CategoryID = ' + req.params.id;

    RunQuery(sqlStr, function (result) {
      res.redirect('/admin/cat');
    });
  });

router.route('/cat/add')
  .get(isAdmin, function (req, res, next) {
    var contextDict = {
      title: 'Admin - Add Category',
      customer: req.user
    };

    res.render('admin/addCat', contextDict);
  })

  .post(isAdmin, function (req, res, next) {
    var sqlStr = '\
        INSERT INTO Categories\
        VALUES (null, \'' + req.body.name + '\', \
            \'' + req.body.description + '\', \
            \'' + slug(req.body.name) + '\', \
            \'' + slug(req.body.name) + '.png\')'
      /*Image = name.png\*/
    ;

    RunQuery(sqlStr, function (category) {
      res.redirect('/admin/cat');
    });
  });

router.route('/products')
  .get(isAdmin, function (req, res, next) {
    var sqlStr = '\
                    SELECT products.*, Categories.CategoryName\
                    FROM products\
                    INNER JOIN Categories\
                    ON products.CategoryID = Categories.CategoryID';

    RunQuery(sqlStr, function (products) {

      var contextDict = {
        title: 'Admin - products',
        products: products,
        customer: req.user
      };

      res.render('admin/products', contextDict);
    });
  });

router.route('/products/:id/edit')
  .get(isAdmin, function (req, res, next) {

    var sqlStr = '\
                    SELECT products.*, Categories.CategoryName\
                    FROM products\
                    INNER JOIN Categories\
                    ON products.CategoryID = Categories.CategoryID\
                    WHERE ProductID = ' + req.params.id;

    RunQuery(sqlStr, function (product) {

      sqlStr = '\
                SELECT *\
                FROM Categories';

      RunQuery(sqlStr, function (categories) {
        product[0].product_varieties = JSON.parse(product[0].product_varieties);
        for (var i=0; i< product[0].product_varieties.length; i++){
          try {
            product[0].product_varieties[i].productId = product[0].ProductID;
          }catch (e) {}
          console.log(product[0].product_varieties[i]);
        }
        var contextDict = {
          title: 'Admin - Edit Product',
          product: product[0],
          // product_varieties: JSON.parse(product[0].product_varieties),
          categories: categories,
          customer: req.user
        };

        res.render('admin/editProduct', contextDict);
      });
    });
  })


//============================== Variety Routes =========================================
router.route('/products/:id/add-variety')
  .get(isAdmin, function (req, res, next) {

    var sqlStr = 'SELECT products.*\
                    FROM products\
                    WHERE ProductID = ' + req.params.id;

    RunQuery(sqlStr, function (product) {

      var contextDict = {
        title: 'Admin - Add Variety',
        product: product[0],
        customer: req.user
      };

      res.render('admin/addVariety', contextDict);
    });
  })
  .post(isAdmin, function (req, res, next) {
    var variety = {};
    variety["size"] = req.body.size;
    variety["color"] = req.body.color;
    variety["quantity"] = req.body.quantity;
    variety["price"] = req.body.price;

    var sqlGetOld = "SELECT product_varieties FROM products WHERE ProductID = " + req.params.id;
    RunQuery(sqlGetOld, function (row) {
      console.log(row[0].product_varieties);

      if(row[0].product_varieties == null) {
        variety["id"] = 1;
        var varieties = [];
        varieties.push(variety);
      }
      else{
        var varieties = JSON.parse(row[0].product_varieties);
        variety["id"] = varieties.length++;
        varieties.push(variety);
      }


      var sqlStr = "UPDATE products SET product_varieties = '" + JSON.stringify(varieties) + "' WHERE ProductID = " + req.params.id;
      console.log(varieties);
      RunQuery(sqlStr, function (row) {
        res.redirect('/admin/products/'+req.params.id+'/edit');
      });

    });
  });


//Edit Variety
router.route('/products/:productId/:varietyId/edit-variety')
  .get(isAdmin, function (req, res, next) {

    var sqlStr = "SELECT product_varieties FROM products WHERE ProductID = " + req.params.productId;

    RunQuery(sqlStr, function (row) {
      let varieties = JSON.parse(row[0].product_varieties);
      let variety = varieties.filter(function(a) {
          return a.id == req.params.varietyId;
      });
      variety[0].productId = req.params.productId;

      console.log(variety[0]);
      var contextDict = {
        title: 'Admin - Edit Variety',
        variety: variety[0],
        customer: req.user
      };

      res.render('admin/editVariety', contextDict);
    });
  })
  .post(isAdmin, upload.array('images', 15), function (req, res, next) {

    var variety = {};
    variety["id"] = req.params.varietyId;
    variety["size"] = req.body.size;
    variety["color"] = req.body.color;
    variety["quantity"] = req.body.quantity;
    variety["price"] = req.body.price;

    //Check if Images were uploaded
    if(req.files.length > 0){
      variety["images"] = [];
      for(var i=0;i<req.files.length;i++){
        variety["images"].push("/"+req.files[i].path);
      }
    }

    var sqlGetOld = "SELECT product_varieties FROM products WHERE ProductID = " + req.params.productId;
    RunQuery(sqlGetOld, function (row) {
      console.log(row[0].product_varieties);


        var varieties = JSON.parse(row[0].product_varieties);
        for(var i= 0; i<varieties.length; i++){
          console.log(req.params.varietyId);
          console.log("varieties ID " + varieties[i].id);
          console.log("variety ID " + req.params.varietyId);

          if(varieties[i].id == req.params.varietyId){
            console.log("HERE");
            varieties[i] = variety;
            console.log(varieties);
          }
        }

      var sqlStr = "UPDATE products SET product_varieties = '" + JSON.stringify(varieties) + "' WHERE ProductID = " + req.params.productId;
      console.log(varieties);
      RunQuery(sqlStr, function (row) {
        res.redirect('/admin/products/'+req.params.productId+'/edit');
      });

    });
  });



router.route('/products/:productId/:varietyId/delete')
  .get(isAdmin, function (req, res, next) {

    var sqlGetOld = "SELECT product_varieties FROM products WHERE ProductID = " + req.params.productId;
    RunQuery(sqlGetOld, function (row) {
      console.log(row[0].product_varieties);

      var varieties = JSON.parse(row[0].product_varieties);
      varieties = varieties.filter(function(a) {
        if(a == null)
          return false;
        else
          return a.id != req.params.varietyId;
      });

      var sqlStr = "UPDATE products SET product_varieties = '" + JSON.stringify(varieties) + "' WHERE ProductID = " + req.params.productId;
      console.log(varieties);
      RunQuery(sqlStr, function (row) {
        res.redirect('/admin/products/'+req.params.productId+'/edit');
      });

    });
  });








router.route('/products/:id/delete')
  .post(isAdmin, function (req, res, next) {

    var sqlStr = '\
            DELETE FROM products\
            WHERE ProductID = ' + req.params.id;

    RunQuery(sqlStr, function (result) {
      res.redirect('/admin/products');
    });
  });

router.route('/products/add')
  .get(isAdmin, function (req, res, next) {

    var sqlStr = '\
            SELECT *\
            FROM Categories';

    RunQuery(sqlStr, function (categories) {
      var contextDict = {
        title: 'Admin - Add Product',
        categories: categories,
        customer: req.user
      };

      res.render('admin/addProduct', contextDict);
    });
  })

  .post(isAdmin, function (req, res, next) {
    var sqlStr = 'INSERT INTO products\
            VALUES (null, \'' + req.body.name + '\', '
      + req.body.category + ', '
      + req.body.price + ', '
      + req.body.unit + ', \
            \'' + req.body.description + '\', '
      + req.body.year + ', \
            \'' + slug(req.body.name) + '.png\', \
            null, \
            \'' + slug(req.body.name) + '\', null, null )'
      /*Image = name.png\*/
    ;
    console.log(sqlStr);

    RunQuery(sqlStr, function (category) {
      res.redirect('/admin/products');
    });
  });

router.route('/orders')
  .get(isAdmin, function (req, res) {

    var selectQuery = '\
            SELECT *\
            FROM Orders';

    RunQuery(selectQuery, function (orders) {

      var contextDict = {
        title: 'Admin - Orders',
        customer: req.user,
        orders: orders
      };

      res.render('admin/orders', contextDict);
    });
  });

router.route('/orders/:id')
  .get(isAdmin, function (req, res) {
    //get order info
    var selectQuery = '\
            SELECT *\
            FROM Orders\
            WHERE OrderID = ' + req.params.id;

    RunQuery(selectQuery, function (order) {
      //get user info
      selectQuery = '\
            SELECT *\
            FROM users\
            WHERE UserID = ' + order[0].UserID;

      RunQuery(selectQuery, function (orderCustomer) {
        //get delivery info
        selectQuery = '\
                SELECT *\
                FROM Addresses\
                WHERE AddressID = ' + order[0].AddressID;

        RunQuery(selectQuery, function (address) {
          //get order info
          selectQuery = '\
                    SELECT *\
                    FROM `Order Details`\
                    INNER JOIN (\
                        SELECT products.*, Categories.CategorySlug\
                        FROM products\
                        INNER JOIN Categories\
                        ON products.CategoryID = Categories.CategoryID\
                    ) `Table`\
                    ON `Order Details`.ProductID = `Table`.ProductID\
                    WHERE OrderID = ' + order[0].OrderID;

          RunQuery(selectQuery, function (products) {
            //get order info

            var contextDict = {
              title: 'Admin - Orders',
              customer: req.user,
              order: order[0],
              orderCustomer: orderCustomer[0],
              address: address[0],
              products: products
            };

            res.render('admin/viewOrder', contextDict);
          });
        });
      });
    });
  });

router.route('/orders/:id/update')
  .get(isAdmin, function (req, res, next) {

    var selectQuery = '\
            SELECT *\
            FROM Orders\
            WHERE OrderID = ' + req.params.id;

    RunQuery(selectQuery, function (order) {

      selectQuery = '\
                SELECT *\
                FROM Addresses\
                WHERE AddressID = ' + order[0].AddressID;

      RunQuery(selectQuery, function (address) {

        selectQuery = '\
                    SELECT *\
                    FROM `Order Details`\
                    INNER JOIN (\
                        SELECT products.*, Categories.CategorySlug\
                        FROM products\
                        INNER JOIN Categories\
                        ON products.CategoryID = Categories.CategoryID\
                    ) `Table`\
                    ON `Order Details`.ProductID = `Table`.ProductID\
                    WHERE OrderID = ' + order[0].OrderID;

        RunQuery(selectQuery, function (products) {
          var contextDict = {
            title: 'Admin - Update Status Order ' + req.params.id,
            customer: req.user,
            order: order[0],
            address: address[0],
            products: products
          };

          res.render('admin/updateOrder', contextDict);

        });
      });
    });
  })

  .post(isAdmin, function (req, res, next) {
    var sqlStr = '\
        UPDATE Orders\
        SET Status = \'' + req.body.status + '\' \
        WHERE OrderID = ' + req.params.id;

    RunQuery(sqlStr, function (result) {
      res.redirect('/admin/orders');
    });
  });

router.route('/customers')
  .get(isAdmin, function (req, res) {

    var selectQuery = '\
            SELECT *\
            FROM users';

    RunQuery(selectQuery, function (customers) {

      var contextDict = {
        title: 'Admin - Customers',
        customer: req.user,
        customers: customers
      };

      res.render('admin/customers', contextDict);
    });
  });

router.route('/customers/:id/makeAdmin')
  .post(isAdmin, function (req, res) {

    var updateQuery = '\
            UPDATE users\
            SET Admin = 1\
            WHERE UserID = ' + req.params.id;

    RunQuery(updateQuery, function (result) {

      res.redirect('/admin/customers/');
    });
  });

router.route('/customers/:id/removeAdmin')
  .post(isAdmin, function (req, res) {

    var updateQuery = '\
            UPDATE users\
            SET Admin = 0\
            WHERE UserID = ' + req.params.id;

    RunQuery(updateQuery, function (result) {

      res.redirect('/admin/customers/');
    });
  });

router.route('/customers/:id/delete')
  .post(isAdmin, function (req, res) {

    var deleteQuery = '\
            DELETE FROM users\
            WHERE UserID = ' + req.params.id;

    RunQuery(deleteQuery, function (result) {

      res.redirect('/admin/customers/');
    });
  });

module.exports = router;

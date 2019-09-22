const fs = require('fs');
const path = require('path');

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json',
);

const getProductFromFile = (wrap) => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      wrap([]);
    } else {
      wrap(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductFromFile((products) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products));
    });
  }

  static fetchAll(wrap) {
    getProductFromFile(wrap);
  }
};

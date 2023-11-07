const db = require('./client')
// const util = require('util');


const createProduct = async({ name, description, price, user_id }) => {
    try {
        const { rows: [product ] } = await db.query(`
        INSERT INTO products(name, description, price, user_id)
        VALUES($1, $2, $3, $4)
        RETURNING *`, [name, description, price, user_id]);

        return product;
    } catch (err) {
        throw err;
    }
}

async function updateProduct(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ product ] } = await db.query(`
      UPDATE products
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return product;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ product ] } = await db.query(`
      UPDATE products
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return product;
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
    try {
      const { rows } = await db.query(`
        SELECT id, name, description, price 
        FROM products;
      `);
    
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function getProductByCategory(productId){
    try {
      const {rows: [ product ]} = await db.query(`
        SELECT category FROM products
        WHERE category = $3
      `, [productId]);
      return product;
    } catch (error) {
      throw error;
    }
  }
  

  async function deleteProductsById(productsId) {
    try {
        const { rows: [products] } = await db.query(`
        DELETE FROM products
        WHERE id=$1
        RETURNING *;
        `, [productsId]);
        return products;
    } catch (error) {
        throw error;
    }
}

async function getProductById(id){
  try {
    const {rows: [ product ]} = await db.query(`
      SELECT * FROM products
      WHERE id = $1
    `, [id]);
    return product;
  } catch (error) {
    throw error;
  }
}

module.exports = {
    createProduct,
    updateProduct,
    getAllProducts,
    getProductByCategory,
    deleteProductsById,
    getProductById
};


import request from 'supertest';
import {app} from '../../src';

describe('/products', () =>{
  beforeAll(async () => {
    await request(app).delete('/__test__/data')
  });

  it('should return 200 and empty array', async () => { 
    await request(app)
      .get('/products')
      .expect(200, []);
  });

  it('should return 404 for non existing product', async () => { 
    await request(app)
      .get('/products/9129919')
      .expect(404);
  });

  it(`should'nt create product with incorrect input data`, async () => {
    await request(app).post('/products').send({title:''}).expect(400);
  });

  let createdProduct: any = null;
  it(`should create product with correct input data`, async () => {
    const createResponse = await request(app).post('/products').send({title:'grape'}).expect(201);

    createdProduct = createResponse.body;

    expect(createdProduct).toEqual({
      id: expect.any(Number),
      title: 'grape'
    });

    await request(app).get('/products').expect(200, [createdProduct]);
  });

  let createdProduct2: any = null;
  it(`create one more product`, async () => {
    const createResponse = await request(app).post('/products').send({title:'oranges'}).expect(201);

    createdProduct2 = createResponse.body;

    expect(createdProduct2).toEqual({
      id: expect.any(Number),
      title: 'oranges'
    });

    await request(app).get('/products').expect(200, [createdProduct, createdProduct2]);
  });

  it(`should'nt update product with incorrect input data`, async () => {
    await request(app).put('/products/' + createdProduct.id).send({title:''}).expect(400);

    await request(app).get('/products/' + createdProduct.id).expect(200, createdProduct);
  });

  it(`should'nt update product that doesn't exist`, async () => {
    await request(app).put('/products/' + -100).send({title:'new title'}).expect(404);
  });

  it(`should update product with correct input data`, async () => {
    await request(app).put('/products/' + createdProduct.id).send({title:'new title'}).expect(204);

    await request(app).get('/products/' + createdProduct.id).expect(200, {
      ...createdProduct,
      title: 'new title'
    });

    await request(app).get('/products/' + createdProduct2.id).expect(200, createdProduct2);
  });

  it('should delete both products', async () => {
    await request(app).delete('/products/' + createdProduct.id).expect(204);

    await request(app).get('/products/' + createdProduct.id).expect(404);

    await request(app).delete('/products/' + createdProduct2.id).expect(204);

    await request(app).get('/products/' + createdProduct2.id).expect(404);
    
    await request(app).get('/products').expect(200, []);
  });
});
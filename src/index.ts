import express, {Request, Response} from 'express';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './type.js';
import { ProductCreateModel } from './models/ProductCreateModel.js';
import { ProductUpdateModel } from './models/ProductUpdateModel.js';
import { ProductsGetQueryModel } from './models/ProductsGetQueryModel.js';
import { ProductViewModel } from './models/ProductViewModel.js';
import { URIParamsIdModel } from './models/URIParamsIdModel.js';

export const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

type ProductType = {
  id: number,
  title: string
};

let products: ProductType[] = [{id: 1, title: 'tomato'}, {id: 2, title: 'orange'}];
let addresses = [{id: 1, value: 'saint st. 120'}, {id: 2, value: 'evil st. 66'}];

app.get('/products', (req: RequestWithQuery<ProductsGetQueryModel>, res: Response<ProductViewModel[]>) => {
  if(req.query.title) {
    let search = String(req.query.title);
    res.send(products.filter(p => p.title.indexOf(search) > -1));
  }
  else res.send(products.map(a => {
    return {
      id: a.id,
      title: a.title
    };
  }));
});

app.get('/products/:id', (req: RequestWithParams<URIParamsIdModel>, res: Response<ProductViewModel>) => {
  let product = products.find(p => p.id === +req.params.id);
  if(product) res.send({
    id: product.id,
    title: product.title
  });
  else res.sendStatus(404);
});

app.get('/addresses', (req, res) => {
  res.send(addresses);
});

app.get('/addresses/:id', (req, res) => {
  let address = addresses.find(p => p.id === +(req.params.id ?? 0));
  if(address) res.send(address);
  else res.status(404).send(404);
});

app.delete('/products/:id', (req: RequestWithParams<URIParamsIdModel>, res) => {
  for(let i = 0; i < products.length; i++){
    if(products[i].id === +req.params.id){
      products.splice(i, 1);
      res.status(204).send(204);
      return;
    }
  }
  res.status(404).send(404);
});

app.post('/products', (req: RequestWithBody<ProductCreateModel>, res: Response<ProductViewModel>) => {
  if(!req.body.title){
    res.sendStatus(400);
    return;
  }
  const newProduct: ProductType = {
    id: +(new Date()),
    title: req.body.title
  };

  products.push(newProduct);

  res.status(201).send(newProduct);
});

app.put('/products/:id', (req: RequestWithParamsAndBody<URIParamsIdModel,ProductUpdateModel>, res) => {
  if(!req.body.title){
    res.sendStatus(400);
    return;
  }

  let product = products.find(p => p.id === +(req.params.id ?? 0));
  if(product) {
    product.title = req.body.title;
    res.status(204).send(product)
  }
  else res.status(404).send(404);
});

app.delete('/__test__/data', (req, res) => {
  products = [];
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
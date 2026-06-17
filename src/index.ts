import express, {Request, Response} from 'express';
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const products = [{id: 1, title: 'tomato'}, {id: 2, title: 'orange'}];
const addresses = [{id: 1, value: 'saint st. 120'}, {id: 2, value: 'evil st. 66'}];

app.get('/products', (req: Request, res: Response) => {
  if(req.query.title) {
    let search = String(req.query.title);
    res.send(products.filter(p => p.title.indexOf(search) > -1));
  }
  else res.send(products);
});

app.get('/products/:id', (req: Request, res: Response) => {
  let product = products.find(p => p.id === +(req.params.id ?? 0));
  if(product) res.send(product);
  else res.status(404).send(404);
});

app.get('/addresses', (req: Request, res: Response) => {
  res.send(addresses);
});

app.get('/addresses/:id', (req: Request, res: Response) => {
  let address = addresses.find(p => p.id === +(req.params.id ?? 0));
  if(address) res.send(address);
  else res.status(404).send(404);
});

app.delete('/products/:id', (req: Request, res: Response) => {
  for(let i = 0; i < products.length; i++){
    if(products[i].id === +req.params.id){
      products.splice(i, 1);
      res.status(204).send(204);
      return;
    }
  }
  res.status(404).send(404);
});

app.post('/products', (req: Request, res: Response) => {
  const newProduct = {
    id: +(new Date()),
    title: req.body.title
  };
  products.push(newProduct);

  res.status(201).send(newProduct);
});

app.put('/products/:id', (req: Request, res: Response) => {
  let product = products.find(p => p.id === +(req.params.id ?? 0));
  if(product) {
    product.title = req.body.title;
    res.send(product)
  }
  else res.status(404).send(404);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
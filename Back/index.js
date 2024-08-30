
  const express = require('express');
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser');
  const path = require('path');




  const app = express();
  app.use(bodyParser.json());

  app.use(express.static('public'));


  // Conexão com o mongo
  mongoose.connect('mongodb://localhost:27017/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Conectado ao MongoDB');
  }).catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });;

  const Product = mongoose.model('Product', {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String }
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });



  // Rotas CRUD


  // (Create)
  app.post('/products', async (req, res) => {
      const product = new Product({
          name: req.body.name,
          price: parseFloat(req.body.price), // Armazenar o preço como número
          description: req.body.description
      });

      try {
          await product.save();
          res.status(201).json(product);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
    });
    

  //  (Read)
  app.get('/products', async (req, res) => {
      try {
          const products = await Product.find(); 
          const formattedProducts = products.map(product => ({
              ...product.toObject(),
              price: new Intl.NumberFormat('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              }).format(product.price)
          }));

          res.status(200).json(formattedProducts);
      } catch (error) {
          res.status(500).send(error);
      }
  });

  //  (Read)
  app.get('/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send();
      }
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  //  (Update)
  app.put('/products/:id', async (req, res) => {
      console.log('Dados recebidos:', req.body);
      try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!product) {
          return res.status(404).send();
        }
        res.status(200).send(product);
      } catch (error) {
        res.status(400).send(error);
      }
    });
    

  //  (Delete)
  app.delete('/products/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).send();
      }
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
  });

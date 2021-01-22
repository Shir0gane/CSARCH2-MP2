const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Non-Restoring Division Calculator'
  });
});

module.exports = router;
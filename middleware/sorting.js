// middleware/sorting.js
module.exports = (req, res, next) => {
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    
    req.sorting = { [sortField]: sortOrder };
    next();
  };
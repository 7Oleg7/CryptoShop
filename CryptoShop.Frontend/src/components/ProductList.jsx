import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';

const ProductList = () => {
  const { products, categories, filters, updateFilters, loading } = useProducts();
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: localSearch });
  };

  const handleCategoryChange = (e) => {
    updateFilters({ categoryId: e.target.value || null });
  };

  const handleSortChange = (e) => {
    updateFilters({ sortBy: e.target.value });
  };

  const handlePriceRangeChange = (min, max) => {
    updateFilters({ minPrice: min, maxPrice: max });
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Filters</h5>
              
              <Form onSubmit={handleSearch}>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search products..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" size="sm" className="w-100">
                  Search
                </Button>
              </Form>

              <Form.Group className="mb-3 mt-3">
                <Form.Label>Category</Form.Label>
                <Form.Select value={filters.categoryId || ''} onChange={handleCategoryChange}>
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price Range</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => handlePriceRangeChange(e.target.value, filters.maxPrice)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handlePriceRangeChange(filters.minPrice, e.target.value)}
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sort By</Form.Label>
                <Form.Select value={filters.sortBy} onChange={handleSortChange}>
                  <option value="name">Name</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <h4 className="mb-3">Products ({products.length})</h4>
              <Row xs={1} md={2} lg={3} className="g-4">
                {products.map(product => (
                  <Col key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
              {products.length === 0 && (
                <div className="text-center mt-5">
                  <h5>No products found</h5>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;
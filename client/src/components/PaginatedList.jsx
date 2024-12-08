import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Pagination } from '@mui/material';

const PaginatedList = ({ fetchData, renderItem, pageSize = 10 }) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data whenever the page changes
    const loadPageData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, totalPages: fetchedTotalPages } = await fetchData(currentPage, pageSize);
        setItems(data);
        setTotalPages(fetchedTotalPages);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [currentPage, fetchData, pageSize]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Box>
      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
      {!loading && !error && (
        <Box>
          {/* Render items */}
          <Box>
            {items.map((item, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                {renderItem(item)}
              </Box>
            ))}
          </Box>

          {/* Pagination Controls */}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ marginTop: 2 }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PaginatedList;

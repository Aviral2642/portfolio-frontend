import React from 'react';
import styled from 'styled-components';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 100px 20px 20px;
`;

const AdminTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 40px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AdminContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 40px;
`;

const Admin = () => {
  return (
    <AdminContainer>
      <AdminTitle>Admin Dashboard</AdminTitle>
      <AdminContent>
        <p>Admin dashboard coming soon...</p>
      </AdminContent>
    </AdminContainer>
  );
};

export default Admin;

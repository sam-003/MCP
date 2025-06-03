export const baseURL = 'https://app.pop.work';

export const testUsers = {
  standard: {
    email: 'standard@example.com',
    password: 'test123',
    role: 'user'
  },
  manager: {
    email: 'manager@example.com',
    password: 'test123',
    role: 'manager'
  },
  admin: {
    email: 'admin@example.com',
    password: 'test123',
    role: 'admin'
  }
};

export const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 }
};

export const testData = {
  largeDataSet: Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `Task ${i}`,
    status: i % 2 === 0 ? 'completed' : 'pending'
  }))
};

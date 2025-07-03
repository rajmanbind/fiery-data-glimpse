interface CuisineItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  zipCode: string;
  cuisine: string[];
  created_at: string | Date;
  // Additional properties for users section
  dietary?: string[];
  // Additional properties for contactUs section
  subject?: string;
  message?: string;
}

// If you want to be more specific with separate interfaces:
interface ChefItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  zipCode: string;
  cuisine: string[];
  created_at: string | Date;
}

interface UserItem extends ChefItem {
  dietary: string[];
}

interface ContactItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string | Date;
}

// // Then you can use them in your component like this:
// {paginatedData.map((item: ChefItem | UserItem | ContactItem) => (
//   // ... your existing JSX
// ))}

// // Or if using the unified interface:
// {paginatedData.map((item: CuisineItem) => (
//   // ... your existing JSX
// ))}
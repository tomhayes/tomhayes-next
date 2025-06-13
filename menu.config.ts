// Define the menu items
export const mainMenu = {
  home: "/",
  blog: "/posts",
};

export const contentMenu = {
  categories: "/posts/categories",
  tags: "/posts/tags",
};

// Define dropdown menus
export const dropdownMenus = {
  "Cool Stuff": [
    { label: "Oblique", href: "/oblique" },
  ],
};

export type DropdownMenus = typeof dropdownMenus;

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AddProductForm } from "./AddProductForm";

export const ProductTable = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 29.99,
      stock: 100,
      category: "Electronics",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      stock: 150,
      category: "Clothing",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <AddProductForm onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil className="w-4 h-4 inline" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Api } from "../../../components/common/Api/api";
import { useToast } from "../../../components/common/Toast";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import { Plus, Edit, Trash2, Package, Search } from "lucide-react";
import ConfirmModal from "../../../components/common/ConfirmModal";

const ProductIndex = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await Api.get("/product");
      setProducts(response.data.data);
    } catch (error) {
      addToast("Failed to fetch products", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    
    setIsDeleting(true);
    try {
      await Api.delete(`/product/${deleteModal.id}`);
      addToast("Product deleted successfully", "success");
      setDeleteModal({ isOpen: false, id: null });
      fetchProducts();
    } catch (error) {
      addToast("Failed to delete product", "danger");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    // ... (Name and Price columns omitted for brevity in thought, but included in actual replacement)
    { 
        header: "Product Name", 
        accessor: "name", 
        render: (val) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Package size={20} />
                </div>
                <span className="font-bold text-gray-900 dark:text-gray-100">{val}</span>
            </div>
        ) 
    },
    { 
        header: "Price", 
        accessor: "price", 
        render: (val) => (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ${parseFloat(val).toFixed(2)}
            </span>
        ) 
    },
    { 
        header: "Description", 
        accessor: "smallDescription", 
        render: (val) => (
            <span className="text-gray-500 dark:text-gray-400 truncate max-w-[250px] inline-block">
                {val || "No description provided"}
            </span>
        ) 
    },
    {
      header: "Actions",
      accessor: "p_id",
      render: (id) => (
        <div className="flex gap-2">
          <Link to={`/admin/product/edit/${id}`}>
            <Button 
                variant="secondary" 
                size="sm" 
                icon={Edit} 
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            />
          </Link>
          <Button
            variant="secondary"
            size="sm"
            icon={Trash2}
            className="hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
            onClick={() => handleDeleteClick(id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Manage your store inventory and product details
          </p>
        </div>
        <Link to="/admin/product/create">
          <Button variant="primary" size="lg" icon={Plus} className="shadow-premium cursor-pointer">
            Add New Product
          </Button>
        </Link>
      </div>

      <Card className="glass shadow-premium border-none overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/30 dark:bg-gray-800/20">
            <div className="relative w-full md:w-96 group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                    <Search size={18} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                Total Products: <span className="text-blue-600 dark:text-blue-400 font-bold">{products.length}</span>
            </div>
        </div>
        <div className="overflow-hidden">
            <Table 
                columns={columns} 
                data={products} 
                hoverable={true}
                className="border-none rounded-none"
            />
        </div>
      </Card>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete Product"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default ProductIndex;

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Api } from "../../../components/common/Api/api";
import { useToast } from "../../../components/common/Toast";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import TextArea from "../../../components/common/TextArea";
import { ArrowLeft, Save, Package, DollarSign } from "lucide-react";

const ProductEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    smallDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await Api.get(`/product/${id}`);
        const product = response.data.data;
        setFormData({
          name: product.name,
          price: product.price,
          smallDescription: product.smallDescription || "",
        });
      } catch (error) {
        addToast("Failed to fetch product data", "danger");
        navigate("/admin/product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, addToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setErrors({});
    try {
      await Api.put(`/product/${id}`, formData);
      addToast("Product updated successfully", "success");
      navigate("/admin/product");
    } catch (error) {
      const fieldErrors = error.response?.data?.errors || {};
      setErrors(fieldErrors);
      addToast(error.response?.data?.message || "Failed to update product", "danger");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Loading product details...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link to="/admin/product">
          <Button 
            variant="secondary" 
            size="sm" 
            icon={ArrowLeft} 
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all hover:bg-gray-200 dark:hover:bg-gray-700" 
          />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Edit Product
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium pt-1">
            Modify the details for <span className="text-blue-600 dark:text-blue-400 font-bold">{formData.name}</span>
          </p>
        </div>
      </div>

      <Card className="glass shadow-premium border-none relative overflow-hidden p-8 sm:p-10">
        {/* Subtle Accent Background - Emerald for Edit */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-emerald-500 to-teal-600" />
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Product Name"
                name="name"
                placeholder="Product name"
                icon={Package}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Price (USD)"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                icon={DollarSign}
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                required
              />
            </div>
          </div>

          <TextArea
            label="Product Description"
            name="smallDescription"
            placeholder="Enter product description..."
            value={formData.smallDescription}
            onChange={handleChange}
            error={errors.smallDescription}
            rows={5}
          />

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              variant="primary"
              className="px-10 py-3 shadow-premium bg-emerald-600 hover:bg-emerald-700 border-none"
              loading={updating}
              icon={Save}
              iconPosition="right"
            >
              Update Product
            </Button>
            <Link to="/admin/product" className="w-full sm:w-auto">
              <Button variant="ghost" type="button" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProductEdit;

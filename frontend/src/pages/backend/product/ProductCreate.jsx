import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Api } from "../../../components/common/Api/api";
import { useToast } from "../../../components/common/Toast";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import TextArea from "../../../components/common/TextArea";
import { ArrowLeft, Save, Package, DollarSign } from "lucide-react";

const ProductCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    smallDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await Api.post("/product", formData);
      addToast("Product created successfully", "success");
      navigate("/admin/product");
    } catch (error) {
      const fieldErrors = error.response?.data?.errors || {};
      setErrors(fieldErrors);
      addToast(error.response?.data?.message || "Failed to create product", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link to="/admin/product">
          <Button 
            variant="secondary" 
            size="sm" 
            icon={ArrowLeft} 
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700" 
          />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            New Product
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium pt-1">
            Fill in the details to add a new product to your inventory
          </p>
        </div>
      </div>

      <Card className="glass shadow-premium border-none relative overflow-hidden p-8 sm:p-10">
        {/* Subtle Accent Background */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-600 to-indigo-600" />
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Product Name"
                name="name"
                placeholder="e.g. MacBook Pro M3"
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
            placeholder="Enter a brief description of the product..."
            value={formData.smallDescription}
            onChange={handleChange}
            error={errors.smallDescription}
            rows={5}
          />

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              variant="primary"
              className="px-10 py-3 shadow-premium"
              loading={loading}
              icon={Save}
              iconPosition="right"
            >
              Create Product
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

export default ProductCreate;

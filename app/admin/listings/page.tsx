"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";
import { formatPrice } from "@/lib/formatPrice";

interface Bike {
  id?: number;
  image: string;
  images?: string[];
  price: string;
  model: string;
  brand: string;
  category?: string[];
  regYear: string;
  kms: string;
  regState: string;
  color?: string;
  fuelType?: string;
  engine?: string;
  description?: string;
  features?: string[];
  condition?: string;
  owner?: string;
  contact?: string;
  status?: 'available' | 'sold' | 'reserved' | 'pending';
  soldAt?: string;
}

export default function AdminListings() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Partial<Bike>>({
    image: '',
    images: [],
    price: '',
    model: '',
    brand: '',
    category: [],
    regYear: '',
    kms: '',
    regState: '',
    color: '',
    fuelType: '',
    engine: '',
    description: '',
    features: [],
    condition: '',
    owner: '',
    contact: '',
    status: 'available',
  });

  useEffect(() => {
    fetchBikes();
    if (editId) {
      const bike = bikes.find(b => b.id === parseInt(editId));
      if (bike) {
        handleEdit(bike);
      }
    }
  }, [editId]);

  const fetchBikes = async () => {
    try {
      const response = await fetch("/api/bikes");
      if (response.ok) {
        const data = await response.json();
        setBikes(data.bikes || []);
      }
    } catch (error) {
      console.error("Error fetching bikes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bikeId: number, newStatus: 'available' | 'sold' | 'reserved' | 'pending') => {
    try {
      const response = await fetch(`/api/bikes/${bikeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        // Optimistically update the local state immediately
        setBikes(prevBikes => 
          prevBikes.map(bike => 
            bike.id === bikeId 
              ? { ...bike, status: newStatus }
              : bike
          )
        );
        // Then fetch fresh data to ensure consistency
        fetchBikes();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Failed to update status: ${errorData.error || 'Unknown error'}`);
        // Refresh to show correct status
        fetchBikes();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
      // Refresh to show correct status
      fetchBikes();
    }
  };

  const handleEdit = (bike: Bike) => {
    setEditingBike(bike);
    setFormData({
      ...bike,
      category: Array.isArray(bike.category) ? bike.category : bike.category ? [bike.category] : [],
      features: Array.isArray(bike.features) ? bike.features : bike.features ? [bike.features] : [],
    });
    setShowAddForm(true);
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleExistingImagesChange = (images: string[]) => {
    setFormData({
      ...formData,
      images,
      image: images.length > 0 ? images[0] : formData.image,
    });
  };

  const uploadFilesToR2 = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const data = await response.json();
      return data.url;
    });

    return Promise.all(uploadPromises);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    const features = value.split('\n').map(f => f.trim()).filter(f => f);
    setFormData({ ...formData, features });
  };

  const handleCategoryChange = (category: string) => {
    const currentCategories = formData.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    setFormData({ ...formData, category: newCategories });
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const response = await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (response.ok) {
        const currentImages = formData.images || [];
        setFormData({
          ...formData,
          images: currentImages.filter(img => img !== imageUrl),
          image: formData.image === imageUrl ? (currentImages[1] || '') : formData.image,
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || formData.category.length === 0) {
      alert('Please select at least one category');
      return;
    }

    setSubmitting(true);
    setUploadingImages(true);

    try {
      let imageUrls: string[] = [];

      if (selectedFiles.length > 0) {
        imageUrls = await uploadFilesToR2(selectedFiles);
      }

      const allImages = [...(formData.images || []), ...imageUrls];
      const bikeData = {
        ...formData,
        images: allImages,
        image: allImages[0] || formData.image,
      };

      const url = editingBike ? `/api/bikes/${editingBike.id}` : "/api/bikes";
      const method = editingBike ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bikeData),
      });

      if (response.ok) {
        resetForm();
        fetchBikes();
        alert(editingBike ? "Bike updated successfully!" : "Bike added successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to save bike'}`);
        
        if (imageUrls.length > 0) {
          for (const url of imageUrls) {
            await fetch("/api/upload/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url }),
            });
          }
        }
      }
    } catch (error) {
      console.error("Error saving bike:", error);
      alert("Failed to save bike. Please try again.");
    } finally {
      setSubmitting(false);
      setUploadingImages(false);
    }
  };

  const resetForm = () => {
    setFormData({
      image: '',
      images: [],
      price: '',
      model: '',
      brand: '',
      category: [],
      regYear: '',
      kms: '',
      regState: '',
      color: '',
      fuelType: '',
      engine: '',
      description: '',
      features: [],
      condition: '',
      owner: '',
      contact: '',
      status: 'available',
    });
    setSelectedFiles([]);
    setEditingBike(null);
    setShowAddForm(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleDelete = async (bikeId: number) => {
    if (!confirm("Are you sure you want to delete this bike?")) return;

    try {
      const response = await fetch(`/api/bikes/${bikeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBikes();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to delete bike'}`);
      }
    } catch (error) {
      console.error('Error deleting bike:', error);
      alert('Failed to delete bike. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading text-gray-900 mb-2 tracking-wider">LISTINGS</h1>
          <div className="w-24 h-1 bg-primary-red"></div>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
          className="bg-primary-red text-white px-6 py-3 rounded-lg hover:bg-primary-red-dark transition-colors font-semibold"
        >
          {showAddForm ? "Cancel" : "+ Add New Bike"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingBike ? "Edit Bike" : "Add New Bike"}
          </h2>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Bike Images *</label>
              <ImageUpload
                onFilesSelected={handleFilesSelected}
                onExistingImagesChange={handleExistingImagesChange}
                multiple={true}
                maxImages={5}
                existingImages={editingBike ? formData.images || [] : []}
                onRemoveExisting={editingBike ? handleDeleteImage : undefined}
              />
              {(uploadingImages || submitting) && (
                <p className="mt-2 text-sm text-blue-600">
                  {uploadingImages ? "Uploading images..." : "Saving bike..."}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="reserved">Reserved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Registration Year *</label>
                <input
                  type="text"
                  name="regYear"
                  value={formData.regYear}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">KMs *</label>
                <input
                  type="text"
                  name="kms"
                  value={formData.kms}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Registration State *</label>
                <input
                  type="text"
                  name="regState"
                  value={formData.regState}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Categories *</label>
                <div className="space-y-2 border border-gray-300 rounded-lg p-4 bg-white">
                  {['Adventure', 'Cruiser', 'Roadster', 'Sport', 'Touring', 'Classics'].map((cat) => (
                    <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.category?.includes(cat) || false}
                        onChange={() => handleCategoryChange(cat)}
                        className="w-4 h-4 text-primary-red border-gray-300 rounded focus:ring-primary-red"
                      />
                      <span className="text-sm font-medium text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  placeholder="e.g., Black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Fuel Type</label>
                <input
                  type="text"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  placeholder="e.g., Petrol"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Engine</label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  placeholder="e.g., 948cc, Liquid-cooled, 4-stroke In-Line Four"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Condition</label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  placeholder="e.g., Excellent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Owner</label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  placeholder="e.g., First Owner"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                placeholder="Enter detailed description of the bike..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Features (one per line)</label>
              <textarea
                name="features"
                value={formData.features?.join('\n') || ''}
                onChange={handleFeaturesChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                placeholder="ABS&#10;Traction Control&#10;Quick Shifter"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Contact Number</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                placeholder="e.g., +919876543210"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingImages}
              className="w-full bg-primary-red text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-red-dark transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingBike ? "Update Bike" : "Add Bike"}
            </button>
          </form>
        </div>
      )}

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand/Model</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bikes.map((bike) => (
                <tr key={bike.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-16 h-16">
                      <Image
                        src={bike.image}
                        alt={bike.model}
                        fill
                        className="object-cover rounded"
                        loading="lazy"
                        sizes="64px"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{bike.brand} {bike.model}</div>
                    <div className="text-sm text-gray-500">{bike.regYear} • {bike.kms} km</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-primary-red">{formatPrice(bike.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={bike.status || 'available'}
                      onChange={(e) => handleStatusChange(bike.id!, e.target.value as any)}
                      className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="reserved">Reserved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(bike)}
                      className="text-primary-red hover:text-primary-red-dark"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bike.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
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
}

